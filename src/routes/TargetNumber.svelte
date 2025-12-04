<script lang="ts">
    import { Input, Label } from "flowbite-svelte";

    let { mode, targetNumber = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");
</script>

<div>
    <Label for="target-num">Target #</Label>
    <Input type="number" id="target-num" bind:value={targetNumber} {disabled} />
</div>
