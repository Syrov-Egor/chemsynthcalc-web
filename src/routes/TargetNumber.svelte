<script lang="ts">
    let { mode, targetNumber = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");
</script>

<label for="target-num">Target #</label>
<input type="number" id="target-num" bind:value={targetNumber} {disabled} />
