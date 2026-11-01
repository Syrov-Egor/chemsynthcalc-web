<script lang="ts">
    import { prettyPrint } from "./scripts/pPrint.svelte";

    let { parsedResult, mode = $bindable() } = $props();

    let isOpen = $derived(mode === "formula" || mode === "balance");
</script>

{#if parsedResult?.details}
    <details open={isOpen} class="rounded-lg border bg-muted shadow-xs">
        <summary
            class="cursor-pointer select-none rounded-lg px-4 py-3 text-sm font-semibold hover:bg-foreground/5"
        >
            Details
        </summary>
        <div class="border-t px-4 py-3">
            <pre class="overflow-x-auto text-s leading-relaxed">{prettyPrint(
                    parsedResult.details,
                )}</pre>
        </div>
    </details>
{/if}
