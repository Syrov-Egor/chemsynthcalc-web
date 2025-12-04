<script lang="ts">
    import { Input } from "flowbite-svelte";
    import { inputPlaceholder } from "./scripts/inputPlaceholder.svelte";

    let { textInput = $bindable() } = $props();
    let placeholder = inputPlaceholder();
</script>

<Input
    type="text"
    id="equation-input"
    size="lg"
    class="placeholder:text-gray-500 placeholder:opacity-50"
    {placeholder}
    bind:value={textInput}
    clearable
/>
