<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label>Float Tolerance</Label>
    <Input id="floatTolerance" type="number" min={-100} max={100} step={1} />
</div>
