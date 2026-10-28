<script lang="ts">
    import ModeRadioGroup from "./ModeRadioGroup.svelte";
    import Algorithm from "./Algorithm.svelte";
    import RunMode from "./RunMode.svelte";
    import TargetNumber from "./TargetNumber.svelte";
    import TargetMass from "./TargetMass.svelte";
</script>

<div class="flex items-center justify-start gap-6">
    <ModeRadioGroup />
    <Algorithm />
    <RunMode />
    <TargetNumber />
    <TargetMass />
</div>
