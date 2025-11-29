<script lang="ts">
    let { controlInput, textInput } = $props();
    import { calculationManager } from "./buttonRun.svelte";
    import { wasmManager } from "./wasm.svelte";

    function onClickButtonRun() {
        calculationManager.run(controlInput, textInput);
    }

    // Cleanup on destroy if needed
    $effect(() => {
        return () => {
            if (calculationManager.isCalculating) {
                calculationManager.reset();
            }
        };
    });
</script>

<button
    type="button"
    id="run-button"
    onclick={onClickButtonRun}
    class:calculating={calculationManager.isCalculating}
    disabled={wasmManager.isLoading}
>
    <span id="button-text">
        {calculationManager.isCalculating ? "Stop" : "Run Calculation"}
    </span>
    {#if wasmManager.isLoading}
        <span class="loading-indicator">(Loading WASM...)</span>
    {/if}
</button>
