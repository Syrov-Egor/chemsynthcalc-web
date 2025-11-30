<script lang="ts">
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import { prettyPrint } from "./scripts/pPrint.svelte";
</script>

<div id="results-section">
    <div id="regular-results-header">
        <h3>Results</h3>
        <div>
            {#if calculationManager.isCalculating}
                <span id="status-text" class="calculating">Calculating...</span>
            {:else if calculationManager.calculationError}
                <span id="status-text" class="error"
                    >Error: {calculationManager.calculationError}</span
                >
            {:else if calculationManager.parsedResult}
                <div id="status-text">
                    {#if calculationManager.parsedResult?.details}
                        <details>
                            <summary>Details</summary>
                            <pre>{prettyPrint(
                                    calculationManager.parsedResult.details,
                                )}</pre>
                        </details>
                    {/if}
                    {#if calculationManager.parsedResult.tabular && calculationManager.parsedResult.tabular.length > 0}
                        <table class="results-table">
                            <thead>
                                <tr>
                                    {#each Object.keys(calculationManager.parsedResult.tabular[0]) as key}
                                        <th>{key}</th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each calculationManager.parsedResult.tabular as row}
                                    <tr>
                                        {#each Object.values(row) as value}
                                            <td>{value}</td>
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    {/if}
                </div>
            {:else}
                <span id="status-text">Ready</span>
            {/if}
        </div>
    </div>
</div>

<style>
    .results-table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 1em;
    }

    .results-table th,
    .results-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    .results-table th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    details {
        margin-top: 1em;
    }

    summary {
        cursor: pointer;
        font-weight: bold;
    }
</style>
