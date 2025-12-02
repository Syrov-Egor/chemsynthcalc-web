<script lang="ts">
    import { prettyPrint } from "./scripts/pPrint.svelte";

    let { parsedResult } = $props();
</script>

{#if parsedResult?.details}
    <details>
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
