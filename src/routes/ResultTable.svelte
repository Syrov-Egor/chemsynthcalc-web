<script lang="ts">
    let { parsedResult } = $props();
</script>

{#if parsedResult?.tabular && parsedResult.tabular.length > 0}
    <table class="results-table">
        <thead>
            <tr>
                {#each Object.keys(parsedResult.tabular[0]) as key (key)}
                    <th>{key}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each parsedResult.tabular as row, i (i)}
                <tr>
                    {#each Object.values(row) as value, j (j)}
                        <td>{value}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

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
</style>
