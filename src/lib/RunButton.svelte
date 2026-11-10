<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import { calculationManager } from "./scripts/buttonRun.svelte";
    import { wasmManager } from "./scripts/wasm.svelte";
    import type { ControlInput } from "$lib/types";

    let {
        controlInput,
        textInput,
        class: className,
        invalid = false,
        errorId,
    }: {
        controlInput: ControlInput;
        textInput: string;
        class?: string;
        invalid?: boolean;
        errorId?: string;
    } = $props();
    function onClickButtonRun() {
        calculationManager.run(controlInput, textInput);
    }

    $effect(() => {
        return () => {
            if (calculationManager.isCalculating) {
                calculationManager.reset();
            }
        };
    });
</script>

<Button
    id="run-button"
    onclick={onClickButtonRun}
    variant={calculationManager.isCalculating ? "destructive" : "default"}
    class={cn(className, calculationManager.isCalculating && "calculating")}
    disabled={invalid && !calculationManager.isCalculating}
    aria-describedby={errorId}
>
    <span id="button-text">
        {calculationManager.isCalculating ? "Stop" : "Run"}
    </span>
    {#if wasmManager.isLoading}
        <span class="loading-indicator">(Loading WASM...)</span>
    {/if}
</Button>
