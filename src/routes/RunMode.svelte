<script lang="ts">
    let { mode, runMode = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "balance");
</script>

<label for="runmode">Run Mode</label>
<select id="runmode" {disabled} bind:value={runMode}>
    <option value="balance">Balance</option>
    <option value="check">Check</option>
    <option value="force">Force</option>
</select>
