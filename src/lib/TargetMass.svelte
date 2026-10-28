<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    let { targetMass = $bindable() }: { targetMass?: number } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="targetMass">Target Mass</Label>
    <Input
        id="targetMass"
        type="number"
        min={0}
        step={1.0}
        bind:value={targetMass}
    />
</div>
