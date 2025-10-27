<script lang="ts">
    import Algorithm from "./Algorithm.svelte";
    import RunMode from "./RunMode.svelte";
    import TargetNumber from "./TargetNumber.svelte";
    import TargetMass from "./TargetMass.svelte";
    import Intify from "./Intify.svelte";
    import OutputPrecision from "./OutputPrecision.svelte";
    import FloatTolerance from "./FloatTolerance.svelte";
    import MaxCombinations from "./MaxCombinations.svelte";

    let { controlInput = $bindable() } = $props();

    let mode = $derived(controlInput.mode);
    let algorithm = $derived(controlInput.algorithm);
    let runMode = $derived(controlInput.runMode);
    let targetNumber = $derived(controlInput.targetNumber);
    let targetMass = $derived(controlInput.targetMass);
    let intify = $derived(controlInput.intify);
    let outputPrecision = $derived(controlInput.outputPrecision);
    let floatTolerance = $derived(controlInput.floatTolerance);
    let maxCombinations = $derived(controlInput.maxCombinations);

    $effect(() => {
        controlInput.mode = mode;
        controlInput.algorithm = algorithm;
        controlInput.runMode = runMode;
        controlInput.targetNumber = targetNumber;
        controlInput.targetMass = targetMass;
        controlInput.intify = intify;
        controlInput.outputPrecision = outputPrecision;
        controlInput.floatTolerance = floatTolerance;
        controlInput.maxCombinations = maxCombinations;
    });
</script>

<fieldset id="modes">
    <legend>Mode</legend>
    <label>
        <input type="radio" bind:group={mode} value="formula" /> Formula
    </label>
    <label>
        <input type="radio" bind:group={mode} value="balance" /> Balance
    </label>
    <label>
        <input type="radio" bind:group={mode} value="masses" /> Masses
    </label>
</fieldset>

<Algorithm {mode} bind:algorithm />
<RunMode {mode} bind:runMode />
<TargetNumber {mode} bind:targetNumber />
<TargetMass {mode} bind:targetMass />
<Intify {mode} bind:intify />
<OutputPrecision {mode} bind:outputPrecision />
<FloatTolerance {mode} bind:floatTolerance />
<MaxCombinations {mode} bind:maxCombinations />
