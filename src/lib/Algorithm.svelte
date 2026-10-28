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
    let value = $state("auto");
</script>

<div class="flex flex-col gap-2 w-full max-w-sm">
    <Label>Algorithm</Label>
    <Select.Root type="single" name="Algorithms" items={algos} bind:value>
        <Select.Trigger class="w-full">
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
