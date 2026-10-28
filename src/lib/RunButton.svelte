<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";

    let { class: className }: { class?: string } = $props();
</script>

<Button class={className}>Run</Button>
