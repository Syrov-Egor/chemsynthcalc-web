<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label>Target mass</Label>
    <Input id="targetMass" type="number" min={0} step={1.0} />
</div>
