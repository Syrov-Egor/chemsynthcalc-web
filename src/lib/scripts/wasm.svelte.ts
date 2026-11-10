type WorkerMessage =
    | { type: 'init' }
    | { type: 'calculate', params: any }
    | { type: 'abort' }

type WorkerResponse =
    | { type: 'ready' }
    | { type: 'result', result: string }
    | { type: 'error', error: string }

const INIT_TIMEOUT_MS = 120000

class WasmManager {
    private worker: Worker | null = null
    private loaded = $state(false)
    private loading = $state(false)
    private loadPromise: Promise<void> | null = null
    private initializationFailure: ((error: Error) => void) | null = null
    private messageHandlers: Map<string, (data: any) => void> = new Map()
    private currentCalculation: {
        resolve: (result: string) => void,
        reject: (error: Error) => void
    } | null = null

    get isLoaded() {
        return this.loaded
    }

    get isLoading() {
        return this.loading
    }

    async load(): Promise<void> {
        if (this.loaded) {
            return
        }

        // Share one in-flight initialization between concurrent callers.
        if (this.loadPromise) {
            return this.loadPromise
        }

        this.loading = true
        const promise = this.startWorker()
        this.loadPromise = promise

        try {
            await promise
            this.loaded = true
        } catch (error) {
            console.error('Failed to initialize Web Worker:', error)
            throw error
        } finally {
            // Only clear the shared state if a newer load has not replaced it.
            if (this.loadPromise === promise) {
                this.loadPromise = null
                this.loading = false
            }
        }
    }

    private async startWorker(): Promise<void> {
        // Never leave a previous worker behind if initialization is retried.
        this.disposeWorker()

        const worker = new Worker(
            new URL('./wasm.worker.ts', import.meta.url),
            { type: 'module' }
        )
        this.worker = worker

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const response = event.data

            // Call any registered handlers
            const handler = this.messageHandlers.get(response.type)
            if (handler) {
                handler(response)
            }
        }

        worker.onerror = (event) => {
            console.error('Worker error:', event)
            const error = new Error(
                `Worker error: ${event.message || 'unknown error'}`
            )

            // Initialization must reject immediately instead of waiting for the timeout.
            this.failInitialization(error)

            if (this.currentCalculation) {
                this.currentCalculation.reject(error)
                this.currentCalculation = null
            }
        }

        try {
            // Initialize the worker and wait for it to be ready
            await this.initWorker(worker)
        } catch (error) {
            // A worker that failed to initialize is unusable; dispose it so
            // retries start with a clean worker instead of leaking the old one.
            this.disposeWorker(worker)
            throw error
        }
    }

    private initWorker(worker: Worker): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let settled = false
            let timer: ReturnType<typeof setTimeout> | undefined

            const cleanup = () => {
                if (timer !== undefined) {
                    clearTimeout(timer)
                    timer = undefined
                }
                this.messageHandlers.delete('ready')
                this.messageHandlers.delete('error')
                if (this.initializationFailure === fail) {
                    this.initializationFailure = null
                }
            }

            const succeed = () => {
                if (settled) return
                settled = true
                cleanup()
                resolve()
            }

            const fail = (error: Error) => {
                if (settled) return
                settled = true
                cleanup()
                reject(error)
            }

            timer = setTimeout(() => {
                fail(new Error('Worker initialization timeout'))
            }, INIT_TIMEOUT_MS)

            this.initializationFailure = fail

            // Register both handlers before posting `init`, so a worker that
            // fails immediately cannot be missed.
            this.messageHandlers.set('ready', succeed)
            this.messageHandlers.set('error', (response: WorkerResponse) => {
                if (response.type === 'error') {
                    fail(new Error(response.error))
                }
            })

            worker.postMessage({ type: 'init' } as WorkerMessage)
        })
    }

    private failInitialization(error: Error) {
        const failure = this.initializationFailure
        if (failure) {
            this.initializationFailure = null
            failure(error)
        }
    }

    private disposeWorker(worker: Worker | null = this.worker) {
        if (!worker) {
            return
        }

        worker.onmessage = null
        worker.onerror = null
        worker.terminate()

        if (this.worker === worker) {
            this.worker = null
            this.loaded = false
        }
    }

    async calculate(params: any): Promise<string> {
        // If we have a current calculation, reject it first
        if (this.currentCalculation) {
            this.currentCalculation.reject(new Error('New calculation started before previous completed'))
            this.currentCalculation = null
        }

        if (!this.loaded) {
            await this.load()
        }

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (this.currentCalculation) {
                    this.currentCalculation.reject(new Error('Calculation timeout'))
                    this.currentCalculation = null
                }
            }, 3000000)

            this.currentCalculation = { resolve, reject }

            const resultHandler = (response: WorkerResponse) => {
                clearTimeout(timeout)
                this.messageHandlers.delete('result')
                this.messageHandlers.delete('error')
                this.currentCalculation = null

                if (response.type === 'result') {
                    resolve(response.result)
                }
            }

            const errorHandler = (response: WorkerResponse) => {
                clearTimeout(timeout)
                this.messageHandlers.delete('result')
                this.messageHandlers.delete('error')
                this.currentCalculation = null

                if (response.type === 'error') {
                    reject(new Error(response.error))
                }
            }

            this.messageHandlers.set('result', resultHandler)
            this.messageHandlers.set('error', errorHandler)

            this.worker?.postMessage({
                type: 'calculate',
                params
            } as WorkerMessage)
        })
    }

    abort() {
        // Terminating also cancels a pending initialization instead of
        // leaving it to time out.
        this.terminate('Calculation aborted by user')
    }

    terminate(reason = 'Calculation aborted') {
        this.failInitialization(new Error(reason))
        this.disposeWorker()
        this.messageHandlers.clear()

        if (this.currentCalculation) {
            this.currentCalculation.reject(new Error(reason))
            this.currentCalculation = null
        }

        this.loadPromise = null
        this.loaded = false
        this.loading = false
    }

    // Add a method to check if we can calculate
    canCalculate(): boolean {
        return !this.loading && !this.currentCalculation
    }
}

export const wasmManager = new WasmManager()
