<script lang="ts">
    let { mode, floatTolerance = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<label for="float-tolerance">Float Tolerance (1e-x)</label>
<input
    type="number"
    id="float-tolerance"
    bind:value={floatTolerance}
    min="1"
    max="15"
    {disabled}
/>
