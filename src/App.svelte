<script lang="ts">
  import "./app.css";
  import { ModeWatcher } from "mode-watcher";
  import type { ControlInput } from "$lib/types";

  import Navbar from "$lib/Navbar.svelte";
  import InputGroup from "$lib/InputGroup.svelte";
  import Results from "$lib/Results.svelte";

  let textInput = $state("");

  let controlInput = $state<ControlInput>({
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

<div>
  <ModeWatcher />
  <Navbar />
  <InputGroup bind:textInput bind:controlInput />
  <Results {controlInput} />
</div>
