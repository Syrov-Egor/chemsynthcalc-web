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

<div class="flex items-center justify-start gap-6">
    <ModeRadioGroup />
    <div
        class="grid grid-cols-2 justify-start gap-6 sm:grid-cols-1 lg:grid-cols-8"
    >
        <Algorithm />
        <RunMode />
        <TargetNumber />
        <TargetMass />
        <Intify />
        <OutputPrecision />
        <FloatTolerance />
        <MaxCoefficient />
    </div>
</div>
