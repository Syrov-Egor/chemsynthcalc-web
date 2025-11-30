<script lang="ts">
    import { Toggle } from "flowbite-svelte";

    let { mode, intify = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<Toggle bind:checked={intify} {disabled}>Intify Coefficients</Toggle>
