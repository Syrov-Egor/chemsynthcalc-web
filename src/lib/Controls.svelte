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
</script>

<div
    class="flex flex-col lg:flex-row items-stretch lg:items-center justify-start gap-1 lg:gap-6"
>
    <ModeRadioGroup />
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
