<script lang="ts">
    let { mode, intify = $bindable() } = $props();
    let disabled = $derived(mode === "formula");
</script>

<label for="intify">Intify Coefficients</label>
<input type="checkbox" id="intify" bind:checked={intify} {disabled} />
