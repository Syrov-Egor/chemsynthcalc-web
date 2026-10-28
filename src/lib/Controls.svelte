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
</script>

<div
    class="flex flex-col lg:flex-row items-stretch lg:items-center justify-start gap-1 lg:gap-6"
>
    <ModeRadioGroup bind:mode={controlInput.mode} />
    <div
        class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-2 py-3 flex-1 min-w-0"
    >
        <Algorithm bind:algorithm={controlInput.algorithm} />
        <RunMode bind:runMode={controlInput.runMode} />
        <TargetNumber bind:targetNumber={controlInput.targetNumber} />
        <TargetMass bind:targetMass={controlInput.targetMass} />
        <OutputPrecision bind:outputPrecision={controlInput.outputPrecision} />
        <FloatTolerance bind:floatTolerance={controlInput.floatTolerance} />
        <MaxCoefficient bind:maxCombinations={controlInput.maxCombinations} />
        <Intify bind:intify={controlInput.intify} />
    </div>
</div>
