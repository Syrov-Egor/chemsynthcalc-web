<script lang="ts">
    import Controls from "./Controls.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";
    import { validateControlInput } from "$lib/scripts/validation";

    let { textInput = $bindable(), controlInput = $bindable() } = $props();

    let controlIssues = $derived(validateControlInput(controlInput));
</script>

<div class="gap-1 px-6 py-3 border-b">
    <Controls bind:controlInput />
    <div
        class="flex flex-col md:flex-row items-stretch md:items-end gap-1 py-2 w-full min-w-0"
    >
        <div class="flex-1 min-w-0">
            <EquationInput bind:textInput />
        </div>
        <div class="w-full md:w-[11.3%] shrink-0">
            <RunButton
                {textInput}
                {controlInput}
                class="w-full"
                invalid={controlIssues.length > 0}
                errorId={controlIssues.length > 0
                    ? "validation-error"
                    : undefined}
            />
        </div>
    </div>
</div>
