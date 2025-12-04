<script lang="ts">
    import { Radio } from "flowbite-svelte";

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

<div class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-9 gap-2 py-2">
    <div class="flex flex-row lg:flex-col gap-2">
        <Radio name="modes" value="formula" bind:group={mode}>Formula</Radio>
        <Radio name="modes" value="balance" bind:group={mode}>Balance</Radio>
        <Radio name="modes" value="masses" bind:group={mode}>Masses</Radio>
    </div>

    <Algorithm {mode} bind:algorithm />
    <RunMode {mode} bind:runMode />
    <TargetNumber {mode} bind:targetNumber />
    <TargetMass {mode} bind:targetMass />
    <Intify {mode} bind:intify />
    <OutputPrecision {mode} bind:outputPrecision />
    <FloatTolerance {mode} bind:floatTolerance />
    <MaxCombinations {mode} bind:maxCombinations />
</div>
