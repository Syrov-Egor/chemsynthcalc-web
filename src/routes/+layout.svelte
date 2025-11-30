<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.ico";
	import { DarkMode } from "flowbite-svelte";

	let { children } = $props();
</script>

<DarkMode />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
