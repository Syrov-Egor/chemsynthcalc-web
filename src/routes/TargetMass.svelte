<script lang="ts">
    let { mode, targetMass = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");
</script>

<label for="target-mass">Target Mass (g)</label>
<input
    bind:value={targetMass}
    type="number"
    id="target-mass"
    min="0"
    step="1.000000"
    {disabled}
/>
