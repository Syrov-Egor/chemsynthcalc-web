<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
</script>

<div class="flex flex-col gap-2 w-full max-w-sm">
    <Label>Target #</Label>
    <Input id="targetNumber" type="number" min={-100} max={100} step={1} />
</div>
