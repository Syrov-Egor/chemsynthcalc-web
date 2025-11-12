import { wasmManager } from "./wasm.svelte";

class CalculationManager {
    public isCalculating = $state(false)
    private shouldAbort = $state(false)

    async run(controlInput: object, textInput: string) {
        // If already calculating, abort current calculation
        if (this.isCalculating) {
            console.log('Aborting current calculation...')
            this.shouldAbort = true
            this.abort()
            return
        }

        // Reset state
        this.shouldAbort = false
        this.isCalculating = true

        try {
            // Merge inputs
            const params = {
                ...controlInput,
                equation: textInput
            }

            console.log('Starting calculation with params:', params)

            // Run calculation in Web Worker
            const result = await wasmManager.calculate(params)

            // Check if we aborted during the calculation
            if (this.shouldAbort) {
                console.log('Calculation was aborted during execution')
                return
            }

            console.log('Calculation result:', result)

            // Parse and display result
            try {
                const parsed = JSON.parse(result)
                if (parsed.cancelled) {
                    console.log('⚠ Calculation was cancelled')
                } else if (parsed.success) {
                    console.log('✓ Calculation successful')
                    console.log('Details:', parsed.details)
                    if (parsed.tabular && parsed.tabular.length > 0) {
                        console.table(parsed.tabular)
                    }
                } else {
                    console.error('✗ Calculation failed:', parsed.message)
                    if (parsed.details) {
                        console.error('Error details:', parsed.details)
                    }
                }
            } catch (e) {
                console.log('Raw result:', result)
            }

        } catch (error) {
            if (this.shouldAbort) {
                console.log('Calculation aborted as requested')
            } else if (error instanceof Error) {
                console.error('Calculation error:', error.message)
            } else {
                console.error('Calculation error:', error)
            }
        } finally {
            this.isCalculating = false
            this.shouldAbort = false
        }
    }

    private abort() {
        wasmManager.abort()
        console.log('Abort signal sent - terminating worker')
    }

    // Reset the manager state
    reset() {
        this.isCalculating = false
        this.shouldAbort = false
        wasmManager.terminate()
    }
}

export const calculationManager = new CalculationManager()