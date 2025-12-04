<script lang="ts">
    import { Toggle } from "flowbite-svelte";

    let { mode, intify = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<Toggle
    color="emerald"
    size="large"
    id="intify-toggle"
    bind:checked={intify}
    {disabled}>Intify coefficients</Toggle
>
