<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import {
        MAX_COMBINATIONS_MAX,
        MAX_COMBINATIONS_MIN,
    } from "$lib/scripts/validation";

    let {
        disabled = false,
        maxCombinations = $bindable(),
    }: { disabled?: boolean; maxCombinations?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="maxCombinations">Max Coefficient</Label>
    <Input
        id="maxCombinations"
        type="number"
        min={MAX_COMBINATIONS_MIN}
        max={MAX_COMBINATIONS_MAX}
        step={1}
        {disabled}
        bind:value={maxCombinations}
    />
</div>
