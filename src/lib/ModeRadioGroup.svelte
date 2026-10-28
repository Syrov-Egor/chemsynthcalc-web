<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
</script>

<RadioGroup.Root
    value="masses"
    class="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3 lg:w-auto"
>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="formula" id="radio-formula" />
        <Label for="formula">Formula</Label>
    </div>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="balance" id="radio-balance" />
        <Label for="balance">Balance</Label>
    </div>
    <div class="flex items-center gap-3">
        <RadioGroup.Item value="masses" id="radio-masses" />
        <Label for="masses">Masses</Label>
    </div>
</RadioGroup.Root>
