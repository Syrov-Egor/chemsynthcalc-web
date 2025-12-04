<script lang="ts">
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import ResultDetails from "./ResultDetails.svelte";
    import ResultTable from "./ResultTable.svelte";
    import { Heading } from "flowbite-svelte";

    let { controlInput } = $props();
    let mode = $derived(controlInput.mode);
</script>

<div id="results-section" class="py-2">
    <div id="regular-results-header">
        <Heading tag="h5">Results</Heading>
        <div>
            {#if calculationManager.isCalculating}
                <span id="status-text" class="calculating">Calculating...</span>
            {:else if calculationManager.calculationError}
                <span id="status-text" class="error"
                    >Error: {calculationManager.calculationError}</span
                >
            {:else if calculationManager.parsedResult}
                <div id="status-text">
                    <ResultDetails
                        parsedResult={calculationManager.parsedResult}
                        {mode}
                    />
                    <ResultTable
                        parsedResult={calculationManager.parsedResult}
                    />
                </div>
            {:else}
                <span id="status-text">Ready</span>
            {/if}
        </div>
    </div>
</div>
