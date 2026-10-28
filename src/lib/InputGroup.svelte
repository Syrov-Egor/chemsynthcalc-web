<script lang="ts">
    import Controls from "./Controls.svelte";
    import EquationInput from "./EquationInput.svelte";
    import RunButton from "./RunButton.svelte";
</script>

<div class="gap-1 px-6 py-3">
    <Controls />
    <div class="flex flex-col md:flex-row items-stretch md:items-end gap-1 py-2 w-full min-w-0">
        <div class="flex-1 min-w-0">
            <EquationInput />
        </div>
        <div class="w-full md:w-[10%] shrink-0">
            <RunButton class="w-full" />
        </div>
    </div>
</div>
