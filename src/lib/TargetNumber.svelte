<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { TARGET_NUMBER_MAX, TARGET_NUMBER_MIN } from "$lib/scripts/validation";

    let {
        disabled = false,
        targetNumber = $bindable(),
    }: { disabled?: boolean; targetNumber?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="targetNumber">Target #</Label>
    <Input
        id="target-number"
        type="number"
        min={TARGET_NUMBER_MIN}
        max={TARGET_NUMBER_MAX}
        step={1}
        {disabled}
        bind:value={targetNumber}
    />
</div>
