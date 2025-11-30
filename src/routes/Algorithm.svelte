<script lang="ts">
    import { Select, Label } from "flowbite-svelte";

    let { mode, algorithm = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "masses");

    let algos = [
        { value: "auto", name: "Auto" },
        { value: "inv", name: "Inv" },
        { value: "gpinv", name: "GPinv" },
        { value: "ppinv", name: "PPinv" },
        { value: "comb", name: "Comb" },
    ];
</script>

<Label>
    Algorithm
    <Select items={algos} bind:value={algorithm} {disabled} />
</Label>
