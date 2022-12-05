<script lang="ts">
  import * as Theme from "$lib/theme"
  import { isDark } from "$lib/theme"
  import {
    faBookOpen,
    faBug,
    faChartPie,
    faClock,
    faComments,
    faHome,
    faMoon,
    faNavicon,
    faSun,
    faTasks,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import "../index.postcss"
  import NavIcon from "./NavIcon.svelte"
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
</script>

<nav class="sticky top-0 flex h-16 w-screen shadow-md">
  <div
    class="mx-auto flex w-full max-w-7xl select-none items-center px-4 sm:px-6 md:px-8"
  >
    <NavLink
      isHomeIcon
      href="/"
      class="icon-bg-gray mr-auto before:content-['Home'] dark:bg-gray-600 dark:before:text-slate-400"
      title="Home"
    >
      <NavIcon icon={faHome} class="icon-gray" />
    </NavLink>

    <NavLink
      href="/assignments"
      class="icon-bg-red before:content-['Assignments']"
      title="Assignments"
    >
      <NavIcon icon={faTasks} class="icon-red" />
    </NavLink>

    <NavLink
      href="/groups"
      class="icon-bg-blue before:content-['Groups']"
      title="Groups"
    >
      <NavIcon icon={faUserGroup} class="icon-blue" />
    </NavLink>

    <NavLink
      href="/progress"
      class="icon-bg-yellow before:content-['Progress']"
      title="Progress"
    >
      <NavIcon icon={faChartPie} class="icon-yellow" />
    </NavLink>

    <NavLink
      href="/resources"
      class="icon-bg-green before:content-['Resources']"
      title="Resources"
    >
      <NavIcon icon={faBookOpen} class="icon-green" />
    </NavLink>

    <NavLink
      href="/discussions"
      class="icon-bg-purple before:content-['Discussions']"
      title="Discussions"
    >
      <NavIcon icon={faComments} class="icon-purple" />
    </NavLink>

    <NavLink
      href="/schedule"
      class="icon-bg-orange before:content-['Schedule']"
      title="Schedule"
    >
      <NavIcon icon={faClock} class="icon-orange" />
    </NavLink>

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
      class="button-icon tooltip icon-bg-gray ml-auto before:content-['Theme'] dark:bg-gray-600 dark:before:text-slate-400"
      on:click={Theme.toggle}
      title="Toggle Theme"
    >
      <NavIcon icon={$isDark ? faMoon : faSun} class="icon-gray" />
    </button>

    <a
      on:contextmenu|preventDefault
      class="button-icon tooltip icon-bg-gray ml-0 before:content-['Report_a_Bug'] dark:bg-gray-600 dark:before:text-slate-400 md:before:whitespace-pre"
      title="Report a Bug"
      href="https://github.com/zSnout/kama-sona/issues/new/choose"
    >
      <NavIcon icon={faBug} class="icon-gray" />
    </a>
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="{isNavIconFocused || isNavIconHovered
      ? 'visible scale-100 opacity-100'
      : 'invisible'} mobile-nav fixed top-14 w-screen bg-white px-4 pt-2 pb-4 shadow-md transition-all hover:opacity-100 dark:bg-slate-800 sm:hidden"
  >
    <NavLinkWide
      href="/assignments"
      class="icon-bg-red before:content-['Assignments']"
      title="Assignments"
      on:click={closeNav}
    >
      <NavIcon icon={faTasks} class="icon-red" />
    </NavLinkWide>

    <NavLinkWide
      href="/groups"
      class="icon-bg-blue before:content-['Groups']"
      title="Groups"
      on:click={closeNav}
    >
      <NavIcon icon={faUserGroup} class="icon-blue" />
    </NavLinkWide>

    <NavLinkWide
      href="/progress"
      class="icon-bg-yellow before:content-['Progress']"
      title="Progress"
      on:click={closeNav}
    >
      <NavIcon icon={faChartPie} class="icon-yellow" />
    </NavLinkWide>

    <NavLinkWide
      href="/resources"
      class="icon-bg-green before:content-['Resources']"
      title="Resources"
      on:click={closeNav}
    >
      <NavIcon icon={faBookOpen} class="icon-green" />
    </NavLinkWide>

    <NavLinkWide
      href="/discussions"
      class="icon-bg-purple before:content-['Discussions']"
      title="Discussions"
      on:click={closeNav}
    >
      <NavIcon icon={faComments} class="icon-purple" />
    </NavLinkWide>

    <NavLinkWide
      href="/schedule"
      class="icon-bg-orange before:content-['Schedule']"
      title="Schedule"
      on:click={closeNav}
    >
      <NavIcon icon={faClock} class="icon-orange" />
    </NavLinkWide>
  </div>
</nav>

<main
  class="mx-auto flex min-h-full w-[80rem] max-w-[100vw] flex-1 flex-col px-4 py-6 sm:px-6 md:px-8"
>
  <slot />
</main>
