<script lang="ts">
    import TopNavBar from "./TopNavBar.svelte";
    import InputGroup from "./InputGroup.svelte";
    import Results from "./Results.svelte";

    let textInput = $state("");

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

<div class="p-4 dark:bg-gray-900">
    <TopNavBar />
    <InputGroup bind:textInput bind:controlInput />
    <Results {controlInput} />
</div>
