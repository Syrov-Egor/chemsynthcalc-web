<script lang="ts">
    import ModeControl from "./ModeControl.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";

    let controlInput = $state({
        mode: "masses",
        algorithm: "auto",
    });
</script>

<ModeControl bind:controlInput />
<EquationInput />
<RunButton {controlInput} />
