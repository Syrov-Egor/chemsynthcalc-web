import wasmExec from '$lib/wasm_exec_tiny?raw'
import wasmUrl from '$lib/main.wasm?url'

let isCalculating = false

declare global {
    interface Window {
        Go: {
            new(): {
                run: (inst: WebAssembly.Instance) => Promise<void>
                importObject: WebAssembly.Imports
            }
        }
        runCalculation?: (params: any) => string
        stopCalculation?: () => void
        isCalculating?: () => boolean
    }
}

type WorkerMessage =
    | { type: 'init' }
    | { type: 'calculate', params: any }
    | { type: 'abort' }

type WorkerResponse =
    | { type: 'ready' }
    | { type: 'result', result: string }
    | { type: 'error', error: string }

let wasmLoaded = false

// Load and execute the Go WASM runtime
async function initWasm() {
    if (wasmLoaded) {
        return
    }

    try {
        // Execute the wasm_exec.js code to set up the Go environment
        eval(wasmExec)

        if (!WebAssembly.instantiateStreaming) {
            // polyfill
            WebAssembly.instantiateStreaming = async (resp, importObject) => {
                const source = await (await resp).arrayBuffer()
                return await WebAssembly.instantiate(source, importObject)
            }
        }

        const go = new (self as any).Go()
        const result = await WebAssembly.instantiateStreaming(
            fetch(wasmUrl),
            go.importObject
        )

        // Run Go runtime (this sets up the WASM environment)
        go.run(result.instance)

        // Wait for functions to be available
        await waitForFunction('runCalculation', 5000)

        wasmLoaded = true
    } catch (error) {
        console.error('[Worker] Failed to initialize WASM:', error)
        throw error
    }
}

function waitForFunction(name: string, timeout: number): Promise<void> {
    const start = Date.now()
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if ((self as any)[name]) {
                clearInterval(interval)
                resolve()
            } else if (Date.now() - start > timeout) {
                clearInterval(interval)
                reject(new Error(`Timeout waiting for ${name}`))
            }
        }, 10)
    })
}

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
    const message = event.data

    try {
        switch (message.type) {
            case 'init':
                await initWasm()
                self.postMessage({ type: 'ready' } as WorkerResponse)
                break

            case 'calculate':
                if (!wasmLoaded) {
                    await initWasm()
                }

                // If already calculating, reject the previous one
                if (isCalculating) {
                    self.postMessage({
                        type: 'error',
                        error: 'Another calculation is already in progress'
                    } as WorkerResponse)
                    break
                }

                isCalculating = true

                try {
                    const runCalculation = (self as any).runCalculation

                    if (!runCalculation) {
                        throw new Error('runCalculation function not available')
                    }

                    const result = runCalculation(message.params)
                    self.postMessage({
                        type: 'result',
                        result: result
                    } as WorkerResponse)
                } catch (error) {
                    console.error('[Worker] Error:', error)
                    self.postMessage({
                        type: 'error',
                        error: error instanceof Error ? error.message : String(error)
                    } as WorkerResponse)
                } finally {
                    isCalculating = false
                }
                break

            case 'abort':
                // Terminate the entire worker to ensure complete cleanup
                const stopCalculation = (self as any).stopCalculation
                if (stopCalculation) {
                    stopCalculation()
                }

                // Force close the worker
                self.close() // This terminates the worker completely
                break

            default:
                console.warn('[Worker] Unknown message type:', message)
        }
    } catch (error) {
        console.error('[Worker] Error:', error)
        self.postMessage({
            type: 'error',
            error: error instanceof Error ? error.message : String(error)
        } as WorkerResponse)
    }
}