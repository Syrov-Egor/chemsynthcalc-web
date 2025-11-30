<script lang="ts">
    import { Input, Label } from "flowbite-svelte";
    import { inputPlaceholder } from "./scripts/inputPlaceholder.svelte";

    let { textInput = $bindable() } = $props();
    let placeholder = inputPlaceholder();
</script>

<Label for="equation-input">Input</Label>
<Input
    type="text"
    id="equation-input"
    {placeholder}
    bind:value={textInput}
    clearable
/>
