<script lang="ts">
    import ModeControl from "./ModeControl.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";

    let { textInput = $bindable(""), controlInput = $bindable() } = $props();
</script>

<ModeControl bind:controlInput />
<EquationInput bind:textInput />
<RunButton {controlInput} {textInput} />
