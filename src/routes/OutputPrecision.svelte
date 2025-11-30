<script lang="ts">
    import { Input, Label } from "flowbite-svelte";

    let { mode, outputPrecision = $bindable() } = $props();
    let disabled = $derived(mode === "balance");
</script>

<Label for="output-precision">Output Precision</Label>
<Input
    type="number"
    id="output-precision"
    bind:value={outputPrecision}
    min="0"
    max="20"
    {disabled}
/>
