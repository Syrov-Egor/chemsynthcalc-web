<script lang="ts">
    let { parsedResult } = $props();
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
</script>

{#if parsedResult?.tabular && parsedResult.tabular.length > 0}
    <Table
        class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-round"
    >
        <TableHead>
            <TableHeadCell>Formula</TableHeadCell>
            <TableHeadCell>Molar mass (g/mol)</TableHeadCell>
            <TableHeadCell>Mass (g)</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each parsedResult.tabular as row, i (i)}
                <TableBodyRow>
                    {#each Object.values(row) as value, j (j)}
                        <TableBodyCell>{value}</TableBodyCell>
                    {/each}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
{/if}
