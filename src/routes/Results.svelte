<script lang="ts">
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import ResultDetails from "./ResultDetails.svelte";
    import ResultTable from "./ResultTable.svelte";
    import { Heading, P, Spinner } from "flowbite-svelte";

    let { controlInput } = $props();
    let mode = $derived(controlInput.mode);
</script>

<div id="results-section" class="py-2">
    <div id="regular-results-header">
        <Heading tag="h5">Results</Heading>
        <div>
            {#if calculationManager.isCalculating}
                <span id="status-text" class="calculating"
                    ><Spinner type="dots" color="emerald" /></span
                >
            {:else if calculationManager.calculationError}
                <P class="text-red-700 dark:text-red-500 py-2" size="lg"
                    ><span id="status-text" class="error"
                        >Error: {calculationManager.calculationError}</span
                    ></P
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
                <P class="py-2"><span id="status-text">Ready</span></P>
            {/if}
        </div>
    </div>
</div>
