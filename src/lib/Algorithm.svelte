<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    const algos = [
        { value: "auto", label: "Auto" },
        { value: "inv", label: "Inv" },
        { value: "gpinv", label: "GPinv" },
        { value: "ppinv", label: "PPinv" },
        { value: "comb", label: "Comb" },
    ];

    let {
        disabled = false,
        algorithm = $bindable(),
    }: { disabled?: boolean; algorithm?: string } = $props();
</script>

<div class="flex flex-col gap-2 w-full min-w-0">
    <Label for="algorithm-select">Algorithm</Label>
    <Select.Root
        type="single"
        items={algos}
        bind:value={algorithm}
        {disabled}
    >
        <Select.Trigger id="algorithm-select" class="w-full">
            <Select.Value placeholder="Select an algorithm" />
        </Select.Trigger>
        <Select.Content class="w-(--bits-select-anchor-width)">
            <Select.Group>
                {#each algos as algo (algo.value)}
                    <Select.Item value={algo.value} label={algo.label}>
                        {algo.label}
                    </Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
    </Select.Root>
</div>
