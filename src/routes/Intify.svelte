<script lang="ts">
    import { Toggle, Label } from "flowbite-svelte";

    let { mode, intify = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<div>
    <Label>Coefs to integers</Label>
    <Toggle
        color="emerald"
        size="large"
        id="intify-toggle"
        bind:checked={intify}
        {disabled}
    ></Toggle>
</div>
