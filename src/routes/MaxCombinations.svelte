<script lang="ts">
    let { mode, maxCombinations = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "masses");
</script>

<label for="max-comb">Max Combinations</label>
<input
    type="number"
    id="max-comb"
    bind:value={maxCombinations}
    min="1"
    {disabled}
/>
