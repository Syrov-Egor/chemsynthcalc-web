<script lang="ts">
    let { controlInput, textInput } = $props();
    import { buttonRun } from "./buttonRun.svelte";

    function onClickButtonRun() {
        buttonRun(controlInput, textInput);
    }
</script>

<button type="button" id="run-button" onclick={onClickButtonRun}>
    <span id="button-text">Run Calculation</span>
</button>
