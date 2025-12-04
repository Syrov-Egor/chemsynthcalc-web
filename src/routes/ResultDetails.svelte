<script lang="ts">
    import { P } from "flowbite-svelte";

    import { prettyPrint } from "./scripts/pPrint.svelte";

    let { parsedResult, mode = $bindable() } = $props();

    let isOpen = $derived(mode === "formula" || mode === "balance");
</script>

{#if parsedResult?.details}
    <details open={isOpen}>
        <summary>Details</summary>
        <pre>{prettyPrint(parsedResult.details)}</pre>
    </details>
{/if}

<style>
    details {
        margin-top: 1em;
    }

    summary {
        cursor: pointer;
        font-weight: bold;
    }
</style>
