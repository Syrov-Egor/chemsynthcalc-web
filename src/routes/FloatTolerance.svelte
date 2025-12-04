<script lang="ts">
    import { Input, Label } from "flowbite-svelte";

    let { mode, floatTolerance = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<div class="flex flex-col">
    <Label for="float-tolerance">Float Tolerance (1e-x)</Label>
    <Input
        type="number"
        id="float-tolerance"
        bind:value={floatTolerance}
        min="1"
        max="15"
        {disabled}
    />
</div>
