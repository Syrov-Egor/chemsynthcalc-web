<script lang="ts">
    let { mode, outputPrecision = $bindable() } = $props();
    let disabled = $derived(mode === "balance");
</script>

<label for="output-precision">Output Precision</label>
<input
    type="number"
    id="output-precision"
    bind:value={outputPrecision}
    min="0"
    max="20"
    {disabled}
/>
