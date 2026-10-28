<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    let { outputPrecision = $bindable(4) }: { outputPrecision?: number } =
        $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="outputPrecision">Output Precision</Label>
    <Input
        id="outputPrecision"
        type="number"
        min={0}
        max={15}
        step={1}
        bind:value={outputPrecision}
    />
</div>
