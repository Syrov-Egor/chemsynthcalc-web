<script lang="ts">
    let { controlInput, textInput } = $props();
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import { wasmManager } from "./scripts/wasm.svelte";

    function onClickButtonRun() {
        calculationManager.run(controlInput, textInput);
    }

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
