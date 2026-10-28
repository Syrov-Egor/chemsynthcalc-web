<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    let { targetNumber = $bindable() }: { targetNumber?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="targetNumber">Target #</Label>
    <Input
        id="target-number"
        type="number"
        min={-100}
        max={100}
        step={1}
        bind:value={targetNumber}
    />
</div>
