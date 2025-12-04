<script lang="ts">
    import { Select, Label } from "flowbite-svelte";

    let { mode, runMode = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");

    let runModes = [
        { value: "balance", name: "Balance" },
        { value: "check", name: "Check" },
        { value: "force", name: "Force" },
    ];
</script>

<Label class="flex flex-col">
    Run mode
    <Select items={runModes} bind:value={runMode} {disabled} placeholder="" />
</Label>
