<script lang="ts">
    let { mode, algorithm = $bindable() } = $props();
    let disabled = $derived(mode === "formula" || mode === "masses");
</script>

<label for="algorithm">Algorithm</label>
<select id="algorithm" {disabled} bind:value={algorithm}>
    <option value="auto">Auto</option>
    <option value="inv">Inv</option>
    <option value="gpinv">GPinv</option>
    <option value="ppinv">PPinv</option>
    <option value="comb">Comb</option>
</select>
