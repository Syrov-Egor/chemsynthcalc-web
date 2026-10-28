<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    const runModes = [
        { value: "balance", label: "Balance" },
        { value: "check", label: "Check" },
        { value: "force", label: "Force" },
    ];

    let { runMode = $bindable("balance") }: { runMode?: string } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label>Run Mode</Label>
    <Select.Root type="single" name="RunModes" items={runModes} bind:value={runMode}>
        <Select.Trigger class="w-full">
            <Select.Value placeholder="Select a run mode" />
        </Select.Trigger>
        <Select.Content class="w-(--bits-select-anchor-width)">
            <Select.Group>
                {#each runModes as mode (mode.value)}
                    <Select.Item value={mode.value} label={mode.label}>
                        {mode.label}
                    </Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
    </Select.Root>
</div>
