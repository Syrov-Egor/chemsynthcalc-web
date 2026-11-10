type WorkerMessage =
    | { type: 'init' }
    | { type: 'calculate', id: number, params: any }
    | { type: 'abort' }

type WorkerResponse =
    | { type: 'ready' }
    | { type: 'result', id: number, result: string }
    | { type: 'error', id?: number, error: string }

const INIT_TIMEOUT_MS = 120000

// Practical upper bound for a single calculation. Typical runs finish in
// milliseconds; failing after two minutes keeps a wedged worker from blocking
// retries for the lifetime of the page.
const CALCULATION_TIMEOUT_MS = 120000

interface CalculationRequest {
    id: number
    resolve: (result: string) => void
    reject: (error: Error) => void
    timer: ReturnType<typeof setTimeout>
    settled: boolean
}

interface CalculationOutcome {
    result?: string
    error?: Error
}

class WasmManager {
    private worker: Worker | null = null
    private loaded = $state(false)
    private loading = $state(false)
    private loadPromise: Promise<void> | null = null
    private initializationFailure: ((error: Error) => void) | null = null
    private messageHandlers: Map<string, (data: any) => void> = new Map()
    private nextCalculationId = 1
    private currentCalculation: CalculationRequest | null = null

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

            // Calculation responses are matched by request ID so a late result
            // from a superseded request can never settle the current one.
            if (response.type === 'result') {
                this.settleCalculation(response.id, { result: response.result })
                return
            }

            if (response.type === 'error' && response.id !== undefined) {
                this.settleCalculation(response.id, {
                    error: new Error(response.error)
                })
                return
            }

            // Initialization messages (`ready`, or an error without a request
            // ID) go through the registered init handlers.
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
                this.finishCalculation(this.currentCalculation, { error })
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
        // A new request supersedes any in-flight one. Terminating is the only
        // way to interrupt synchronous WASM work, so the worker is recreated
        // and reloaded before the new request is posted.
        if (this.currentCalculation) {
            this.terminate(
                'New calculation started before previous completed'
            )
        }

        if (!this.loaded) {
            await this.load()
        }

        return new Promise<string>((resolve, reject) => {
            const request: CalculationRequest = {
                id: this.nextCalculationId++,
                resolve,
                reject,
                // Assigned immediately below; the request is only reachable
                // through `currentCalculation` afterwards.
                timer: undefined as unknown as ReturnType<typeof setTimeout>,
                settled: false
            }

            request.timer = setTimeout(() => {
                // A matching request that exceeds the deadline cannot be
                // cancelled cooperatively, so terminate the worker and reject
                // through the same cleanup path as every other outcome.
                if (
                    !request.settled &&
                    this.currentCalculation === request
                ) {
                    this.terminate('Calculation timeout')
                }
            }, CALCULATION_TIMEOUT_MS)

            this.currentCalculation = request

            if (!this.worker) {
                this.finishCalculation(request, {
                    error: new Error('Worker is not available')
                })
                return
            }

            this.worker.postMessage({
                type: 'calculate',
                id: request.id,
                params
            } as WorkerMessage)
        })
    }

    // Settle the current request only if the response belongs to it.
    private settleCalculation(id: number, outcome: CalculationOutcome) {
        const request = this.currentCalculation
        if (!request || request.id !== id) {
            // Stale response from a request that was already superseded,
            // aborted, or timed out.
            return
        }
        this.finishCalculation(request, outcome)
    }

    // Single place where a request is marked settled, its timer is cleared,
    // and its promise is resolved or rejected.
    private finishCalculation(
        request: CalculationRequest,
        outcome: CalculationOutcome
    ) {
        if (request.settled) {
            return
        }

        request.settled = true
        clearTimeout(request.timer)

        if (this.currentCalculation === request) {
            this.currentCalculation = null
        }

        if (outcome.error) {
            request.reject(outcome.error)
        } else {
            request.resolve(outcome.result ?? '')
        }
    }

    abort() {
        // Terminating also cancels a pending initialization instead of
        // leaving it to time out.
        this.terminate('Calculation aborted by user')
    }

    terminate(reason = 'Calculation aborted') {
        this.failInitialization(new Error(reason))

        if (this.currentCalculation) {
            this.finishCalculation(this.currentCalculation, {
                error: new Error(reason)
            })
        }

        this.disposeWorker()
        this.messageHandlers.clear()

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
