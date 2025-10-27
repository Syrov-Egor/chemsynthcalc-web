<script lang="ts">
    import Algorithm from "./Algorithm.svelte";
    import RunMode from "./RunMode.svelte";
    import TargetNumber from "./TargetNumber.svelte";
    import TargetMass from "./TargetMass.svelte";
    import OutputPrecision from "./OutputPrecision.svelte";
    import FloatTolerance from "./FloatTolerance.svelte";
    import MaxCombinations from "./MaxCombinations.svelte";

    let { controlInput = $bindable() } = $props();

    let mode = $derived(controlInput.mode);
    let algorithm = $derived(controlInput.algorithm);

    $effect(() => {
        controlInput.mode = mode;
        controlInput.algorithm = algorithm;
    });
</script>

<fieldset id="modes">
    <label for="modes">Mode</label>
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
<RunMode />
<TargetNumber />
<TargetMass />
<OutputPrecision />
<FloatTolerance />
<MaxCombinations />
