<script lang="ts">
    import { Input, Label } from "flowbite-svelte";

    let { mode, targetMass = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");
</script>

<div class="flex flex-col">
    <Label for="target-mass">Target Mass (g)</Label>
    <Input
        type="number"
        id="target-mass"
        bind:value={targetMass}
        min="0"
        step="1.000000"
        {disabled}
    />
</div>
