<script lang="ts">
  import * as Theme from "$lib/theme"
  import { isDark } from "$lib/theme"
  import {
    faBookOpen,
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
      class="mr-auto bg-gray-200 text-gray-500 before:content-['Home'] dark:bg-gray-600 dark:before:text-slate-400"
      title="Home"
    >
      <NavIcon
        icon={faHome}
        class="fill-gray-200 dark:fill-gray-700 dark:stroke-gray-300"
      />
    </NavLink>

    <NavLink
      href="/assignments"
      class="bg-red-200 text-red-500 before:content-['Assignments'] dark:bg-red-800"
      title="Tasks"
    >
      <NavIcon
        icon={faTasks}
        class="fill-red-200 dark:fill-red-700 dark:stroke-red-300"
      />
    </NavLink>

    <NavLink
      href="/groups"
      class="bg-blue-200 text-blue-500 before:content-['Groups'] dark:bg-blue-800"
      title="Groups"
    >
      <NavIcon
        icon={faUserGroup}
        class="fill-blue-200 dark:fill-blue-700 dark:stroke-blue-300"
      />
    </NavLink>

    <NavLink
      href="/progress"
      class="bg-yellow-200 text-yellow-500 before:content-['Progress'] dark:bg-yellow-800"
      title="Progress"
    >
      <NavIcon
        icon={faChartPie}
        class="fill-yellow-200 dark:fill-yellow-700 dark:stroke-yellow-300"
      />
    </NavLink>

    <NavLink
      href="/resources"
      class="bg-green-200 text-green-500 before:content-['Resources'] dark:bg-green-800"
      title="Resources"
    >
      <NavIcon
        icon={faBookOpen}
        class="fill-green-200 dark:fill-green-700 dark:stroke-green-300"
      />
    </NavLink>

    <NavLink
      href="/discussions"
      class="bg-purple-200 text-purple-500 before:content-['Discussions'] dark:bg-purple-800"
      title="Discussions"
    >
      <NavIcon
        icon={faComments}
        class="fill-purple-200 dark:fill-purple-700 dark:stroke-purple-300"
      />
    </NavLink>

    <NavLink
      href="/schedule"
      class="bg-orange-200 text-orange-500 before:content-['Schedule'] dark:bg-orange-800"
      title="Schedule"
    >
      <NavIcon
        icon={faClock}
        class="fill-orange-200 dark:fill-orange-700 dark:stroke-orange-300"
      />
    </NavLink>

    <button
      on:contextmenu|preventDefault
      class="button-icon block bg-gray-200 text-gray-500 dark:bg-gray-600 dark:before:text-slate-400 sm:hidden"
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
      <NavIcon
        icon={faNavicon}
        class="fill-gray-200 dark:fill-gray-700 dark:stroke-gray-300"
      />
    </button>

    <button
      on:contextmenu|preventDefault
      class="button-icon tooltip ml-auto bg-gray-200 text-gray-500 before:content-['Theme'] dark:bg-gray-600 dark:before:text-slate-400"
      on:click={Theme.toggle}
      title="Toggle Theme"
    >
      <NavIcon
        icon={$isDark ? faMoon : faSun}
        class="fill-gray-200 dark:fill-gray-700 dark:stroke-gray-300"
      />
    </button>
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="{isNavIconFocused || isNavIconHovered
      ? 'visible scale-100 opacity-100'
      : 'invisible'} mobile-nav fixed top-14 w-screen bg-white px-4 pt-2 pb-4 shadow-md transition-all hover:opacity-100 dark:bg-slate-800 sm:hidden"
  >
    <NavLinkWide
      href="/assignments"
      class="bg-red-200 text-red-500 before:content-['Assignments'] dark:bg-red-800"
      title="Tasks"
      on:click={closeNav}
    >
      <NavIcon
        icon={faTasks}
        class="fill-red-200 dark:fill-red-700 dark:stroke-red-300"
      />
    </NavLinkWide>

    <NavLinkWide
      href="/groups"
      class="bg-blue-200 text-blue-500 before:content-['Groups'] dark:bg-blue-800"
      title="Groups"
      on:click={closeNav}
    >
      <NavIcon
        icon={faUserGroup}
        class="fill-blue-200 dark:fill-blue-700 dark:stroke-blue-300"
      />
    </NavLinkWide>

    <NavLinkWide
      href="/progress"
      class="bg-yellow-200 text-yellow-500 before:content-['Progress'] dark:bg-yellow-800"
      title="Progress"
      on:click={closeNav}
    >
      <NavIcon
        icon={faChartPie}
        class="fill-yellow-200 dark:fill-yellow-700 dark:stroke-yellow-300"
      />
    </NavLinkWide>

    <NavLinkWide
      href="/resources"
      class="bg-green-200 text-green-500 before:content-['Resources'] dark:bg-green-800"
      title="Resources"
      on:click={closeNav}
    >
      <NavIcon
        icon={faBookOpen}
        class="fill-green-200 dark:fill-green-700 dark:stroke-green-300"
      />
    </NavLinkWide>

    <NavLinkWide
      href="/discussions"
      class="bg-purple-200 text-purple-500 before:content-['Discussions'] dark:bg-purple-800"
      title="Discussions"
      on:click={closeNav}
    >
      <NavIcon
        icon={faComments}
        class="fill-purple-200 dark:fill-purple-700 dark:stroke-purple-300"
      />
    </NavLinkWide>

    <NavLinkWide
      href="/schedule"
      class="bg-orange-200 text-orange-500 before:content-['Schedule'] dark:bg-orange-800"
      title="Schedule"
      on:click={closeNav}
    >
      <NavIcon
        icon={faClock}
        class="fill-orange-200 dark:fill-orange-700 dark:stroke-orange-300"
      />
    </NavLinkWide>
  </div>
</nav>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
  <slot />
</div>
