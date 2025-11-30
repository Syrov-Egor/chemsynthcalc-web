<script lang="ts">
    import { inputPlaceholder } from "./scripts/inputPlaceholder.svelte";
    let { textInput = $bindable() } = $props();
    let placeholder = inputPlaceholder();
</script>

<label for="equation-input">Input</label>
<input type="text" id="equation-input" {placeholder} bind:value={textInput} />
