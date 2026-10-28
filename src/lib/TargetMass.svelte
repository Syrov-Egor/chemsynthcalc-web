<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
</script>

<div class="flex flex-col gap-2 w-full max-w-sm">
    <Label>Target mass</Label>
    <Input id="targetMass" type="number" min={0} step={1.0} />
</div>
