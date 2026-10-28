<script lang="ts">
    import Label from "./components/ui/label/label.svelte";
    import { Switch } from "$lib/components/ui/switch/index.js";
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label>Coefs to integers</Label>
    <div class="flex h-8 w-full items-center">
        <Switch size="lg" />
    </div>
</div>
