<script lang="ts">
    import {
        DarkMode,
        Navbar,
        NavLi,
        NavUl,
        NavHamburger,
        P,
    } from "flowbite-svelte";

    import { GithubSolid } from "flowbite-svelte-icons";
    import { version } from "./../../package.json" assert { type: "json" };

    const downloadLink =
        "https://github.com/Syrov-Egor/chemsynthcalc-GUI/releases";
    const wikiLink = "https://github.com/Syrov-Egor/chemsynthcalc-GUI/wiki";
    const githubLink = "https://github.com/Syrov-Egor/chemsynthcalc-web";
</script>

<Navbar fluid={true} class="p-0 sm:px-0">
    <NavHamburger />
    <NavUl>
        <NavLi href={wikiLink}><P>How to use</P></NavLi>
        <NavLi href={downloadLink}><P>Download desktop app</P></NavLi>
        <NavLi href={githubLink}><GithubSolid class="shrink-0 h-7 w-7" /></NavLi
        >
        <NavLi
            ><P class="text-emerald-700 dark:text-emerald-500"
                >chemsynthcalc {version}</P
            ></NavLi
        >
        <DarkMode />
    </NavUl>
</Navbar>
