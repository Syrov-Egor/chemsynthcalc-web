<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";

    let {
        disabled = false,
        intify = $bindable(),
    }: { disabled?: boolean; intify?: boolean } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="intify">Coefs To Integers</Label>
    <div class="flex h-8 w-full items-center">
        <Switch id="intify" size="lg" {disabled} bind:checked={intify} />
    </div>
</div>
