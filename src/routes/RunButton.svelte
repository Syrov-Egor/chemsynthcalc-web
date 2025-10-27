<script lang="ts">
    let { controlInput } = $props();

    function logInputs() {
        console.log($state.snapshot(controlInput));
    }
</script>

<button type="button" id="run-button" onclick={logInputs}>
    <span id="button-text">Run Calculation</span>
</button>
