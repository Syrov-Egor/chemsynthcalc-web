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
    let fDisabled = $derived(controlInput.mode === "formula");
    let bDisabled = $derived(controlInput.mode === "balance");
    let fmDisabled = $derived(
        controlInput.mode === "formula" || controlInput.mode === "masses",
    );
    let fbDisabled = $derived(
        controlInput.mode === "formula" || controlInput.mode === "balance",
    );
</script>

<div
    class="flex flex-col lg:flex-row items-stretch lg:items-center justify-start gap-1 lg:gap-6"
>
    <ModeRadioGroup bind:mode={controlInput.mode} />
    <div
        class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-8 gap-2 py-3 flex-1 min-w-0"
    >
        <Algorithm
            disabled={fmDisabled}
            bind:algorithm={controlInput.algorithm}
        />
        <RunMode disabled={fbDisabled} bind:runMode={controlInput.runMode} />
        <TargetNumber
            disabled={fbDisabled}
            bind:targetNumber={controlInput.targetNumber}
        />
        <TargetMass
            disabled={fbDisabled}
            bind:targetMass={controlInput.targetMass}
        />
        <OutputPrecision
            disabled={bDisabled}
            bind:outputPrecision={controlInput.outputPrecision}
        />
        <FloatTolerance
            disabled={fDisabled}
            bind:floatTolerance={controlInput.floatTolerance}
        />
        <MaxCoefficient
            disabled={fmDisabled}
            bind:maxCombinations={controlInput.maxCombinations}
        />
        <Intify disabled={fDisabled} bind:intify={controlInput.intify} />
    </div>
</div>
