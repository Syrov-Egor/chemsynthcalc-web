<script lang="ts">
    import { Input, Label } from "flowbite-svelte";

    let { mode, maxCombinations = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "masses");
</script>

<Label for="max-comb">Max coefficient</Label>
<Input
    type="number"
    id="max-comb"
    bind:value={maxCombinations}
    min="1"
    {disabled}
/>
