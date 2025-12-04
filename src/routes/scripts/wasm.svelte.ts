type WorkerMessage =
    | { type: 'init' }
    | { type: 'calculate', params: any }
    | { type: 'abort' }

type WorkerResponse =
    | { type: 'ready' }
    | { type: 'result', result: string }
    | { type: 'error', error: string }

class WasmManager {
    private worker: Worker | null = null
    private loaded = $state(false)
    private loading = $state(false)
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

    async load() {
        if (this.loaded || this.loading) {
            return
        }

        this.loading = true

        try {
            // Create the worker
            this.worker = new Worker(
                new URL('./wasm.worker.ts', import.meta.url),
                { type: 'module' }
            )

            // Set up message handler
            this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
                const response = event.data

                // Call any registered handlers
                const handler = this.messageHandlers.get(response.type)
                if (handler) {
                    handler(response)
                }
            }

            this.worker.onerror = (error) => {
                console.error('Worker error:', error)
                if (this.currentCalculation) {
                    this.currentCalculation.reject(new Error(`Worker error: ${error.message}`))
                    this.currentCalculation = null
                }
            }

            // Initialize the worker and wait for it to be ready
            await this.initWorker()

            this.loaded = true
        } catch (error) {
            console.error('Failed to initialize Web Worker:', error)
            throw error
        } finally {
            this.loading = false
        }
    }

    private initWorker(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Worker initialization timeout'))
            }, 120000)

            this.messageHandlers.set('ready', () => {
                clearTimeout(timeout)
                this.messageHandlers.delete('ready')
                resolve()
            })

            this.worker?.postMessage({ type: 'init' } as WorkerMessage)
        })
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
        // Terminate the entire worker to ensure WASM stops completely
        this.terminate()

        // Reject the current calculation
        if (this.currentCalculation) {
            this.currentCalculation.reject(new Error('Calculation aborted by user'))
            this.currentCalculation = null
        }
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate()
            this.worker = null
            this.loaded = false
            this.loading = false
        }
    }

    // Add a method to check if we can calculate
    canCalculate(): boolean {
        return !this.loading && !this.currentCalculation
    }
}

export const wasmManager = new WasmManager()