<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    let { floatTolerance = $bindable(8) }: { floatTolerance?: number } =
        $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="floatTolerance">Float Tolerance</Label>
    <Input
        id="floatTolerance"
        type="number"
        min={0}
        max={15}
        step={1}
        bind:value={floatTolerance}
    />
</div>
