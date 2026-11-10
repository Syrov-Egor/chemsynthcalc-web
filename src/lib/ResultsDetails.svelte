<script lang="ts">
    import { prettyPrint } from "./scripts/pPrint.svelte";
    import type { CalculationResult, Mode } from "$lib/types";

    let {
        parsedResult,
        mode = $bindable(),
    }: {
        parsedResult: CalculationResult | null;
        mode?: Mode;
    } = $props();

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
