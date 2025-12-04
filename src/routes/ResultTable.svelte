<script lang="ts">
    let { parsedResult } = $props();
    import {
        P,
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
            <TableHeadCell><P weight="semibold">Formula</P></TableHeadCell>
            <TableHeadCell
                ><P weight="semibold">Molar mass (g/mol)</P></TableHeadCell
            >
            <TableHeadCell><P weight="semibold">Mass (g)</P></TableHeadCell>
        </TableHead>
        <TableBody>
            {#each parsedResult.tabular as row, i (i)}
                <TableBodyRow>
                    {#each Object.values(row) as value, j (j)}
                        <TableBodyCell
                            ><P weight="semibold">{value}</P></TableBodyCell
                        >
                    {/each}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
{/if}
