<script lang="ts">
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import ResultsDetails from "./ResultsDetails.svelte";
    import ResultsTable from "./ResultsTable.svelte";
    import { Spinner } from "$lib/components/ui/spinner/index.js";

    let { controlInput } = $props();
    let mode = $derived(controlInput.mode);
</script>

<section id="results-section" class="px-6 py-4">
    <div id="regular-results-header">
        <h2 class="mb-3 text-lg font-semibold tracking-tight">Results</h2>
        <div>
            {#if calculationManager.isCalculating}
                <div
                    id="status-text"
                    class="calculating flex items-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner />
                    <span>Calculating...</span>
                </div>
            {:else if calculationManager.calculationError}
                <p id="status-text" class="error text-base text-destructive">
                    Error: {calculationManager.calculationError}
                </p>
            {:else if calculationManager.parsedResult}
                <div id="status-text" class="flex flex-col gap-4">
                    <ResultsDetails
                        parsedResult={calculationManager.parsedResult}
                        {mode}
                    />
                    <ResultsTable
                        parsedResult={calculationManager.parsedResult}
                    />
                </div>
            {:else}
                <p id="status-text" class="text-sm text-muted-foreground">
                    Ready
                </p>
            {/if}
        </div>
    </div>
</section>
