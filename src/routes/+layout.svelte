<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation"
  import { pages } from "$lib/pages"
  import * as Theme from "$lib/theme"
  import { isDark } from "$lib/theme"
  import {
    faBug,
    faHome,
    faMoon,
    faNavicon,
    faSun,
  } from "@fortawesome/free-solid-svg-icons"
  import { expoOut } from "svelte/easing"
  import { tweened } from "svelte/motion"
  import { fade } from "svelte/transition"
  import "../index.postcss"
  import NavIcon from "./home/NavIcon.svelte"
  import NavLink from "./NavLink.svelte"
  import NavLinkWide from "./NavLinkWide.svelte"

  let isNavIconHovered = false
  let isNavIconFocused = false

  function closeNav() {
    isNavIconFocused = false
    isNavIconHovered = false

    const active = document.activeElement
    if (active instanceof HTMLElement) {
      active.blur()
    }
  }

  const navProgress = tweened(0, {
    duration: 3500,
    easing: expoOut,
  })

  let navState: "loading" | "loaded" | undefined = undefined

  $: if (navState == "loading") {
    navProgress.set(0.7)
  } else if (navState == "loaded") {
    navProgress
      .set(1, { duration: 500 })
      .then(() => navProgress.set(0, { duration: 0 }))
  }

  let navStateChangeTimeoutId = 0

  beforeNavigate((navigation) => {
    if (navigation.type == "leave") {
      return
    }

    navStateChangeTimeoutId = setTimeout(() => {
      navState = "loading"
    }, 500) as unknown as number
  })

  afterNavigate((navigation) => {
    if (navigation.type == "enter") {
      return
    }

    clearTimeout(navStateChangeTimeoutId)

    if (navState == "loading") {
      navState = "loaded"
    }
  })
</script>

<nav
  class="sticky top-0 z-50 flex h-16 w-screen select-none bg-white shadow-md dark:bg-slate-800 print:hidden"
>
  {#if navState == "loading" || $navProgress != 0}
    <div
      class="fixed top-0 h-1 bg-blue-500 transition-[width] dark:bg-blue-700"
      style:width="{100 * $navProgress}%"
      out:fade={{ delay: 500 }}
    />
  {/if}

  <div class="mx-auto flex w-full max-w-7xl items-center px-4 sm:px-6 md:px-8">
    <NavLink
      href="/home"
      class="bg-gray-250 icon-bg-gray mr-auto dark:bg-gray-600 dark:before:text-slate-400"
      title="Home"
      tooltip="Home"
    >
      <NavIcon icon={faHome} class="icon-gray" />
    </NavLink>

    {#each pages as page}
      <NavLink
        href={page.href}
        class="icon-bg-{page.color}"
        title={page.title}
        tooltip={page.title}
      >
        <NavIcon icon={page.icon} class="icon-{page.color}" />
      </NavLink>
    {/each}

    <button
      on:contextmenu|preventDefault
      class="button-icon icon-bg-gray block dark:bg-gray-600 dark:before:text-slate-400 sm:hidden"
      class:active={isNavIconFocused || isNavIconHovered}
      title="Open Mobile Navigation"
      on:click={() => (
        (isNavIconFocused = !isNavIconFocused),
        isNavIconFocused ? 0 : (isNavIconHovered = false)
      )}
      on:mouseover={() => (isNavIconHovered = true)}
      on:mouseleave={() => (isNavIconHovered = false)}
      on:focus={() => 0}
    >
      <NavIcon icon={faNavicon} class="icon-gray" />
    </button>

    <button
      on:contextmenu|preventDefault
      class="button-icon icon-bg-gray ml-auto outline-none ring-current active:ring-0 focus:ring-2 dark:bg-gray-600 dark:before:text-slate-400"
      on:click={Theme.toggle}
      title="Toggle Theme"
      data-tooltip="Theme"
    >
      <NavIcon icon={$isDark ? faMoon : faSun} class="icon-gray" />
    </button>

    <a
      on:contextmenu|preventDefault
      class="button-icon icon-bg-gray ml-0 outline-none ring-current active:ring-0 focus:ring-2 dark:bg-gray-600 dark:before:text-slate-400 md:before:whitespace-pre"
      title="Report a Bug"
      href="https://github.com/zSnout/kama-sona/issues"
      data-tooltip="Report a Bug"
    >
      <NavIcon icon={faBug} class="icon-gray" />
    </a>
  </div>

  <div
    class="{isNavIconFocused || isNavIconHovered
      ? 'visible scale-100 opacity-100'
      : 'invisible'} mobile-nav fixed top-14 w-screen bg-white px-4 pt-2 pb-4 shadow-md transition-all hover:opacity-100 dark:bg-slate-800 sm:hidden"
  >
    {#each pages as page}
      <NavLinkWide
        href={page.href}
        class="icon-bg-{page.color}"
        title={page.title}
        on:click={closeNav}
      >
        <NavIcon icon={page.icon} class="icon-{page.color}" />
      </NavLinkWide>
    {/each}
  </div>
</nav>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
  class="mx-auto flex min-h-full w-[80rem] max-w-[100vw] flex-1 select-none flex-col px-4 py-6 sm:px-6 md:px-8"
  on:click={(event) => {
    const targets = event.composedPath()

    if (
      targets.find(
        (target) =>
          target instanceof HTMLAnchorElement && target.target == "_blank"
      )
    ) {
      event.stopPropagation()
    }
  }}
>
  <slot />
</main>
