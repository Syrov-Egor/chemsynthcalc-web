<script lang="ts">
    import ModeControl from "./ModeControl.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";

    let controlInput = $state({
        mode: "masses",
        algorithm: "auto",
        runMode: "balance",
        targetNumber: 0,
        targetMass: 1.0,
        intify: true,
        outputPrecision: 4,
        floatTolerance: 8,
        maxCombinations: 15,
    });
</script>

<ModeControl bind:controlInput />
<EquationInput />
<RunButton {controlInput} />
