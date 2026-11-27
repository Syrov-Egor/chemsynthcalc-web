import { wasmManager } from "./wasm.svelte";
import { validateCalculationParams } from "./validation";
import type { CalculationResult, ControlInput } from "$lib/types";

class CalculationManager {
    public isCalculating = $state(false)
    public parsedResult = $state<CalculationResult | null>(null)
    public calculationError = $state<string | null>(null)
    private shouldAbort = $state(false)
    // Invalidates continuations of superseded or reset runs so a late result
    // or error cannot overwrite the state of a newer run.
    private runId = 0

    async run(controlInput: ControlInput, textInput: string) {
        // If already calculating, abort current calculation
        if (this.isCalculating) {
            this.shouldAbort = true
            this.abort()
            return
        }

        const runId = ++this.runId

        // Reset state
        this.shouldAbort = false
        this.isCalculating = true
        this.parsedResult = null
        this.calculationError = null

        const params = {
            ...controlInput,
            equation: textInput
        }

        // Reject invalid controls before they reach the worker so a bad value
        // cannot crash rendering or request an unreasonable search.
        const validation = validateCalculationParams(params)

        if (!validation.ok) {
            this.isCalculating = false
            this.calculationError = validation.message
            return
        }

        try {
            // Run calculation in Web Worker
            const result = await wasmManager.calculate(validation.params)

            // Check if this run is still the current one
            if (runId !== this.runId || this.shouldAbort) {
                return
            }

            this.calculationError = null
            if (result.cancelled) {
                this.parsedResult = null
            } else if (result.success) {
                this.parsedResult = result
            } else {
                console.error('✗ Calculation failed:', result.message)
                if (result.details) {
                    console.error('Error details:', result.details)
                }
                this.parsedResult = null
                this.calculationError = result.message || 'Calculation failed'
            }
        } catch (error) {
            if (runId === this.runId && !this.shouldAbort) {
                this.calculationError = error instanceof Error ? error.message : String(error)
                console.error('Calculation error:', this.calculationError)
            }
        } finally {
            if (runId === this.runId) {
                this.isCalculating = false
                this.shouldAbort = false
            }
        }
    }

    private abort() {
        wasmManager.abort()
    }

    // Reset the manager state
    reset() {
        // Invalidate any in-flight run before terminating its worker so its
        // pending promise cannot settle the manager afterwards.
        this.runId++
        this.isCalculating = false
        this.parsedResult = null
        this.calculationError = null
        this.shouldAbort = false
        wasmManager.terminate()
    }
}

export const calculationManager = new CalculationManager()
