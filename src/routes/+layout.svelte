<script lang="ts">
  import { browser } from "$app/environment"
  import { afterNavigate, beforeNavigate } from "$app/navigation"
  import { pages } from "$lib/pages"
  import * as Theme from "$lib/theme"
  import { isDark } from "$lib/theme"
  import { customTheme, themeable } from "$lib/themeable"
  import {
    faBug,
    faHome,
    faMoon,
    faNavicon,
    faSearch,
    faSun,
  } from "@fortawesome/free-solid-svg-icons"
  import { expoOut } from "svelte/easing"
  import { tweened } from "svelte/motion"
  import { fade } from "svelte/transition"
  import "../index.postcss"
  import NavIcon from "./home/NavIcon.svelte"
  import NavLink from "./NavLink.svelte"
  import NavLinkWide from "./NavLinkWide.svelte"
  import Sidebar from "./Sidebar.svelte"

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

  $: if (browser) {
    for (const { css } of themeable) {
      document.documentElement.style.setProperty(
        "--light-" + css.slice(2),
        $customTheme["--light-" + css.slice(2)] || null
      )

      document.documentElement.style.setProperty(
        "--dark-" + css.slice(2),
        $customTheme["--dark-" + css.slice(2)] || null
      )
    }

    document.documentElement.classList.toggle(
      "flat",
      $customTheme.flat == "true"
    )

    document.documentElement.classList.toggle(
      "instant",
      $customTheme.instant == "true"
    )

    document.documentElement.classList.toggle(
      "sharp",
      $customTheme.sharp == "true"
    )
  }
</script>

<nav
  class="sticky top-0 z-50 flex h-16 w-screen select-none border-y border-t-transparent shadow-md nav-bg nav-border-b print:hidden"
>
  {#if navState == "loading" || $navProgress != 0}
    <div
      class="fixed top-0 h-1 transition-[width] bg-loading-bar"
      style:width="{100 * $navProgress}%"
      out:fade={{ delay: 500 }}
    />
  {/if}

  <div class="mx-auto flex w-full max-w-7xl items-center px-4 sm:px-6 md:px-8">
    <NavLink href="/home" class="nav-icon-bg" title="Home" tooltip="Home">
      <NavIcon icon={faHome} class="nav-icon-fill nav-icon-stroke" />
    </NavLink>

    <NavLink
      href="/search?range=week"
      class="ml-0 mr-auto nav-icon-bg"
      title="Search"
      tooltip="Search"
    >
      <NavIcon icon={faSearch} class="nav-icon-fill nav-icon-stroke" />
    </NavLink>

    {#each pages as page}
      {#if !page.search}
        <NavLink
          href={page.href}
          class="icon-bg-{page.color}"
          title={page.title}
          tooltip={page.title}
        >
          <NavIcon icon={page.icon} class="icon-{page.color}" />
        </NavLink>
      {/if}
    {/each}

    <button
      on:contextmenu|preventDefault
      class="button-icon block nav-icon-bg sm:hidden"
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
      <NavIcon icon={faNavicon} class="nav-icon-fill nav-icon-stroke" />
    </button>

    <button
      on:contextmenu|preventDefault
      class="button-icon ml-auto outline-none ring-current nav-icon-bg active:ring-0 focus:ring-2 md:before:whitespace-pre"
      on:click={Theme.toggle}
      title="Toggle Theme"
      data-tooltip="Theme"
    >
      <NavIcon
        icon={$isDark ? faSun : faMoon}
        class="duration-[0ms] nav-icon-fill nav-icon-stroke"
      />
    </button>

    <a
      on:contextmenu|preventDefault
      class="button-icon ml-0 outline-none ring-current nav-icon-bg active:ring-0 focus:ring-2 md:before:whitespace-pre"
      title="Report a Bug"
      href="https://github.com/zSnout/kama-sona/issues"
      data-tooltip="Report a Bug"
    >
      <NavIcon icon={faBug} class="nav-icon-fill nav-icon-stroke" />
    </a>
  </div>

  <div
    class="{isNavIconFocused || isNavIconHovered
      ? 'visible scale-100 opacity-100'
      : 'invisible'} mobile-nav fixed top-14 w-screen px-4 pt-2 pb-4 shadow-md transition-all nav-bg hover:opacity-100 sm:hidden"
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

{#if browser}
  <Sidebar />
{/if}
