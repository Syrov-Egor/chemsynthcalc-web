<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import {
        FLOAT_TOLERANCE_MAX,
        FLOAT_TOLERANCE_MIN,
    } from "$lib/scripts/validation";

    let {
        disabled = false,
        floatTolerance = $bindable(),
    }: { disabled?: boolean; floatTolerance?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="floatTolerance">
        <span>
            Float Tolerance (1×10<sup class="text-[0.7em] align-super leading-none">−x</sup>)
        </span>
    </Label>
    <Input
        id="floatTolerance"
        type="number"
        min={FLOAT_TOLERANCE_MIN}
        max={FLOAT_TOLERANCE_MAX}
        step={1}
        {disabled}
        bind:value={floatTolerance}
    />
</div>
