<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

    let { mode = $bindable("masses") } = $props();
</script>

<RadioGroup.Root
    bind:value={mode}
    class="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3 lg:w-auto"
>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="formula" id="mode-formula" />
        <Label for="mode-formula">Formula</Label>
    </div>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="balance" id="mode-balance" />
        <Label for="mode-balance">Balance</Label>
    </div>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="masses" id="mode-masses" />
        <Label for="mode-masses">Masses</Label>
    </div>
</RadioGroup.Root>
