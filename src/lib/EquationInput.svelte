<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import XIcon from "@lucide/svelte/icons/x";
    import { inputPlaceholder } from "./scripts/inputPlaceholder.svelte";

    let placeholder = inputPlaceholder();
    let value = $state("");
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label>Input</Label>
    <InputGroup.Root>
        <InputGroup.Input {placeholder} bind:value />
        {#if value}
            <InputGroup.Addon align="inline-end">
                <InputGroup.Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Clear input"
                    onclick={() => (value = "")}
                >
                    <XIcon />
                </InputGroup.Button>
            </InputGroup.Addon>
        {/if}
    </InputGroup.Root>
</div>
