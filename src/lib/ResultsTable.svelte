<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import {
        OUTPUT_PRECISION_MAX,
        OUTPUT_PRECISION_MIN,
    } from "$lib/scripts/validation";

    let { parsedResult, outputPrecision = 4 } = $props();

    let precision = $derived(
        typeof outputPrecision === "number" && Number.isFinite(outputPrecision)
            ? Math.min(
                  OUTPUT_PRECISION_MAX,
                  Math.max(OUTPUT_PRECISION_MIN, Math.trunc(outputPrecision)),
              )
            : 4,
    );

    function formatValue(value: unknown): string {
        return typeof value === "number"
            ? value.toFixed(precision)
            : String(value);
    }
</script>

{#if parsedResult?.tabular && parsedResult.tabular.length > 0}
    <div class="overflow-hidden rounded-lg border bg-muted shadow-xs">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Formula</Table.Head>
                    <Table.Head>Molar Mass (g/mol)</Table.Head>
                    <Table.Head>Mass (g)</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each parsedResult.tabular as row, i (i)}
                    <Table.Row>
                        {#each Object.values(row) as value, j (j)}
                            <Table.Cell class="font-semibold"
                                >{formatValue(value)}</Table.Cell
                            >
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
{/if}
