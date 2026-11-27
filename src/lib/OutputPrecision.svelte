<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import {
        OUTPUT_PRECISION_MAX,
        OUTPUT_PRECISION_MIN,
    } from "$lib/scripts/validation";

    let {
        disabled = false,
        outputPrecision = $bindable(),
    }: { disabled?: boolean; outputPrecision?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="outputPrecision">Output Precision</Label>
    <Input
        id="outputPrecision"
        type="number"
        min={OUTPUT_PRECISION_MIN}
        max={OUTPUT_PRECISION_MAX}
        step={1}
        {disabled}
        bind:value={outputPrecision}
    />
</div>
