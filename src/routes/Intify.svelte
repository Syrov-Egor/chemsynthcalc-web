<script lang="ts">
    import { Toggle, Label } from "flowbite-svelte";

    let { mode, intify = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<Toggle
    color="teal"
    size="large"
    id="intify-toggle"
    bind:checked={intify}
    {disabled}>Intify coefficients</Toggle
>
