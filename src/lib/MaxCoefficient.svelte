<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    let { maxCombinations = $bindable() }: { maxCombinations?: number } =
        $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="maxCombinations">Max Coefficient</Label>
    <Input
        id="maxCombinations"
        type="number"
        min={1}
        step={1}
        bind:value={maxCombinations}
    />
</div>
