// Side-effect import of the TinyGo glue. Importing it as a module (rather than
// evaluating its text with `eval`) lets the site run under a CSP without
// 'unsafe-eval'. The glue only defines globals such as `globalThis.Go`.
import '$lib/wasm/wasm_exec.js'
import wasmUrl from '$lib/wasm/main.wasm?url'
import type { CalculationParams, CalculationResult } from '$lib/types'
import type { WorkerRequest, WorkerResponse } from './workerProtocol'

let isCalculating = false

declare global {
    interface Window {
        Go: {
            new(): {
                run: (inst: WebAssembly.Instance) => Promise<void>
                importObject: WebAssembly.Imports
            }
        }
        runCalculation?: (params: CalculationParams) => CalculationResult
        stopCalculation?: () => void
        isCalculating?: () => boolean
    }
}

let wasmLoaded = false
// A Go runtime that has exited or panicked cannot be restarted inside this
// worker. Once this is set, every further message is rejected and the main
// thread is expected to terminate and recreate the worker.
let runtimeFailed = false

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error)
}

// Report an unrecoverable runtime failure to the main thread. The worker stays
// alive only long enough for the message to be delivered; the main thread
// terminates it and creates a fresh one on the next attempt.
function markRuntimeFailed(error: unknown) {
    if (runtimeFailed) {
        return
    }

    runtimeFailed = true
    wasmLoaded = false
    console.error('[Worker] Go runtime failed:', error)
    self.postMessage({
        type: 'fatal',
        error: `Go runtime failed: ${errorMessage(error)}`
    } as WorkerResponse)
}

// Load and execute the Go WASM runtime
async function initWasm() {
    if (runtimeFailed) {
        throw new Error('Go runtime is no longer available')
    }

    if (wasmLoaded) {
        return
    }

    try {
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

        // `go.run` resolves when the Go program exits and rejects when the
        // runtime traps or aborts. It must never be fire-and-forget: an
        // unobserved rejection would leave this worker marked as loaded and
        // every later call would wait for the calculation timeout.
        void go.run(result.instance).then(
            () => markRuntimeFailed(new Error('Go runtime exited unexpectedly')),
            (error: unknown) => markRuntimeFailed(error)
        )

        // Wait for functions to be available
        await waitForFunction('runCalculation', 5000)

        if (runtimeFailed) {
            throw new Error('Go runtime exited before it was ready')
        }

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
            } else if (runtimeFailed) {
                // Stop waiting as soon as the runtime is known to be dead
                // instead of burning the full timeout.
                clearInterval(interval)
                reject(new Error('Go runtime exited before it was ready'))
            } else if (Date.now() - start > timeout) {
                clearInterval(interval)
                reject(new Error(`Timeout waiting for ${name}`))
            }
        }, 10)
    })
}

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
    const message = event.data

    // Calculation errors are tagged with the request ID so the main thread can
    // ignore responses that belong to a request it has already abandoned.
    const requestId = message.type === 'calculate' ? message.id : undefined

    try {
        switch (message.type) {
            case 'init':
                await initWasm()
                self.postMessage({ type: 'ready' } as WorkerResponse)
                break

            case 'calculate':
                if (runtimeFailed) {
                    throw new Error('Go runtime is no longer available')
                }

                if (!wasmLoaded) {
                    await initWasm()
                }

                // If already calculating, reject the previous one
                if (isCalculating) {
                    self.postMessage({
                        type: 'error',
                        id: requestId,
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
                        id: requestId,
                        // Go hands back a plain, structured-cloneable object.
                        // Send it directly; the main thread validates its shape.
                        result
                    } as WorkerResponse)
                } catch (error) {
                    console.error('[Worker] Error:', error)
                    self.postMessage({
                        type: 'error',
                        id: requestId,
                        error: errorMessage(error)
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
            id: requestId,
            error: errorMessage(error)
        } as WorkerResponse)
    }
}
