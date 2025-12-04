<script lang="ts">
    import { Label } from "flowbite-svelte";
    import ModeControl from "./ModeControl.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";

    let { textInput = $bindable(""), controlInput = $bindable() } = $props();
</script>

<ModeControl bind:controlInput />

<Label for="input-group">Input</Label>
<div id="input-group" class="flex gap-1">
    <EquationInput bind:textInput />
    <RunButton {controlInput} {textInput} />
</div>
