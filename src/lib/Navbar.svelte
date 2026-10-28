<script lang="ts">
    import QuestionIcon from "@lucide/svelte/icons/circle-question-mark";
    import DownloadIcon from "@lucide/svelte/icons/download";
    import GithubIcon from "@lucide/svelte/icons/git-compare";
    import MenuIcon from "@lucide/svelte/icons/menu";
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { version } from "./../../package.json" with { type: "json" };

    const links = [
        {
            href: "https://github.com/Syrov-Egor/chemsynthcalc-GUI/wiki/How-to-use",
            label: "How to use",
            icon: QuestionIcon,
        },
        {
            href: "https://github.com/Syrov-Egor/chemsynthcalc-GUI/releases",
            label: "Download app",
            icon: DownloadIcon,
        },
        {
            href: "https://github.com/Syrov-Egor/chemsynthcalc-web",
            label: "Source code",
            icon: GithubIcon,
        },
    ];

    let open = $state(false);
    let hash = $state(window.location.hash || "#home");

    const isActive = (href: string) => hash === href;
</script>

<svelte:window onhashchange={() => (hash = window.location.hash || "#home")} />

<header class="border-b">
    <nav
        class="flex h-14 items-center justify-start gap-1 px-4"
        aria-label="Main"
    >
        <!-- Mobile: hamburger + sheet -->
        <div class="md:hidden">
            <Sheet.Root bind:open>
                <Sheet.Trigger>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            variant="ghost"
                            size="icon"
                            aria-label="Open menu"
                        >
                            <MenuIcon class="size-5" />
                        </Button>
                    {/snippet}
                </Sheet.Trigger>
                <Sheet.Content side="left" class="w-64">
                    <Sheet.Header>
                        <Sheet.Title>Menu</Sheet.Title>
                    </Sheet.Header>
                    <ul class="flex flex-col gap-1 px-4">
                        <li>
                            <span
                                class="flex h-8 items-center px-2.5 text-sm font-medium text-sidebar-primary"
                            >
                                chemsynthcalc v{version}
                            </span>
                        </li>
                        {#each links as link (link.href)}
                            <li>
                                <Button
                                    href={link.href}
                                    variant={isActive(link.href)
                                        ? "secondary"
                                        : "ghost"}
                                    class="w-full justify-start"
                                    aria-current={isActive(link.href)
                                        ? "page"
                                        : undefined}
                                    onclick={() => (open = false)}
                                >
                                    {#if link.icon}
                                        <link.icon class="size-4" />
                                    {/if}
                                    {link.label}
                                </Button>
                            </li>
                        {/each}
                        <li>
                            <Button
                                onclick={toggleMode}
                                variant="ghost"
                                class="w-full justify-start"
                                aria-label="Toggle theme"
                            >
                                <span
                                    class="relative flex size-4 items-center justify-center"
                                >
                                    <SunIcon
                                        class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
                                    />
                                    <MoonIcon
                                        class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
                                    />
                                </span>
                                Toggle theme
                            </Button>
                        </li>
                    </ul>
                </Sheet.Content>
            </Sheet.Root>
        </div>

        <!-- Desktop: inline links -->
        <ul class="hidden items-center gap-1 md:flex">
            <li>
                <span
                    class="flex h-8 items-center px-2.5 text-sm font-medium text-sidebar-primary"
                >
                    chemsynthcalc v{version}
                </span>
            </li>
            {#each links as link (link.href)}
                <li>
                    <Button
                        href={link.href}
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        size="sm"
                        aria-current={isActive(link.href) ? "page" : undefined}
                    >
                        {#if link.icon}
                            <link.icon class="size-4" />
                        {/if}
                        {link.label}
                    </Button>
                </li>
            {/each}
            <li>
                <Button
                    onclick={toggleMode}
                    variant="ghost"
                    size="sm"
                    aria-label="Toggle theme"
                >
                    <span
                        class="relative flex size-4 items-center justify-center"
                    >
                        <SunIcon
                            class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
                        />
                        <MoonIcon
                            class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
                        />
                    </span>
                    Toggle theme
                </Button>
            </li>
        </ul>
    </nav>
</header>
