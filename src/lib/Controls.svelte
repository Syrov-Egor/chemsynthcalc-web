<script lang="ts">
    import ModeRadioGroup from "./ModeRadioGroup.svelte";
    import Algorithm from "./Algorithm.svelte";
    import RunMode from "./RunMode.svelte";
    import TargetNumber from "./TargetNumber.svelte";
    import TargetMass from "./TargetMass.svelte";
    import Intify from "./Intify.svelte";
    import OutputPrecision from "./OutputPrecision.svelte";
    import FloatTolerance from "./FloatTolerance.svelte";
    import MaxCoefficient from "./MaxCoefficient.svelte";

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

<div
    class="flex flex-col lg:flex-row items-stretch lg:items-center justify-start gap-1 lg:gap-6"
>
    <ModeRadioGroup bind:mode />
    <div
        class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-2 py-3 flex-1 min-w-0"
    >
        <Algorithm />
        <RunMode />
        <TargetNumber />
        <TargetMass />
        <OutputPrecision />
        <FloatTolerance />
        <MaxCoefficient />
        <Intify />
    </div>
</div>
