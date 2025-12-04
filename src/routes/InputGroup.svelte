<script lang="ts">
    import { Label } from "flowbite-svelte";
    import ModeControl from "./ModeControl.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";

    let { textInput = $bindable(""), controlInput = $bindable() } = $props();
</script>

<div class="w-full max-w-full">
    <ModeControl bind:controlInput />
</div>

<Label for="input-group">Input</Label>
<div id="input-group" class="flex flex-col md:flex-row gap-1 py-2 w-full">
    <EquationInput bind:textInput />
    <RunButton {controlInput} {textInput} />
</div>
