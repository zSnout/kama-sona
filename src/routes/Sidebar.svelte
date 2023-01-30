<script lang="ts" context="module">
  export const isSidebarOpen = writable("sidebar:open", true)
  export const isHelpOpen = writable("sidebar:open:help", false)
  export const isNotesOpen = writable("sidebar:open:notes", false)
  export const isTodosOpen = writable("sidebar:open:todos", false)
  export const isThemeOpen = writable("sidebar:open:theme", false)
  export const isActivityOpen = writable("sidebar:open:activity", false)
</script>

<script lang="ts">
  import Activity from "$lib/activity/Activity.svelte"
  import Icon from "$lib/Icon.svelte"
  import { note, notifyOtherSetters, setters } from "$lib/noteStore"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import ThemeEditor from "$lib/ThemeEditor.svelte"
  import Todo from "$lib/Todo.svelte"
  import {
    faChevronLeft,
    faChevronRight,
    faNoteSticky,
    faPalette,
    faPuzzlePiece,
    faQuestion,
    faTasks,
  } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"

  $: isFullyOpen =
    $isSidebarOpen &&
    ($isHelpOpen ||
      $isNotesOpen ||
      $isTodosOpen ||
      $isThemeOpen ||
      $isActivityOpen)

  $: sidebarItems = [
    {
      name: "Help",
      icon: faQuestion,
      open: $isHelpOpen,
      onClick: () => {
        isHelpOpen.update(($open) => !$open)
        isNotesOpen.set(false)
        isTodosOpen.set(false)
        isThemeOpen.set(false)
        isActivityOpen.set(false)
      },
    },
    {
      name: "Notes",
      icon: faNoteSticky,
      open: $isNotesOpen,
      onClick: () => {
        isHelpOpen.set(false)
        isNotesOpen.update(($open) => !$open)
        isTodosOpen.set(false)
        isThemeOpen.set(false)
        isActivityOpen.set(false)
      },
    },
    {
      name: "Todos",
      icon: faTasks,
      open: $isTodosOpen,
      onClick: () => {
        isHelpOpen.set(false)
        isNotesOpen.set(false)
        isTodosOpen.update(($open) => !$open)
        isThemeOpen.set(false)
        isActivityOpen.set(false)
      },
    },
    {
      name: "Theme Editor",
      icon: faPalette,
      open: $isThemeOpen,
      onClick: () => {
        isHelpOpen.set(false)
        isNotesOpen.set(false)
        isTodosOpen.set(false)
        isThemeOpen.update(($open) => !$open)
        isActivityOpen.set(false)
      },
    },
    {
      name: "Daily Activity",
      icon: faPuzzlePiece,
      open: $isActivityOpen,
      onClick: () => {
        isHelpOpen.set(false)
        isNotesOpen.set(false)
        isTodosOpen.set(false)
        isThemeOpen.set(false)
        isActivityOpen.update(($open) => !$open)
      },
    },
  ] as const
</script>

<div
  aria-hidden={!$isSidebarOpen}
  class="fixed top-0 {isFullyOpen
    ? 'right-0'
    : $isSidebarOpen
    ? '-right-82'
    : '-right-[25rem]'} prefer-w-96 z-40 hidden h-full select-none border-l pt-16 shadow-horiz-lg transition-all sidebar-bg sidebar-outer-border md:flex"
  class:prefer-w-[30rem]={($isHelpOpen || $isActivityOpen) && $isSidebarOpen}
  class:prefer-w-[40rem]={$isThemeOpen && $isSidebarOpen}
>
  <div class="flex h-full w-14 flex-col items-center pt-2">
    {#each sidebarItems as { name, icon, open, onClick }}
      <button
        class="ring-color flex h-10 w-10 items-center justify-center rounded-full border border-transparent outline-none transition sidebar-button-color before:z-50 before:whitespace-nowrap hover:sidebar-button-hover-bg hover:sidebar-button-hover-color focus:ring"
        class:sidebar-button-hover-bg={open}
        class:sidebar-button-hover-color={open}
        aria-label="Toggle {name}"
        data-tooltip={name}
        tabindex={$isSidebarOpen ? 0 : -1}
        on:click={onClick}
      >
        <Icon class="h-5 w-5" {icon} />
      </button>
    {/each}
  </div>

  <!-- Useful classes for a generic container: h-full flex-1 border-l border-standard -->

  {#if $isSidebarOpen}
    {#if $isNotesOpen}
      <RichTextArea
        class="resize-none"
        fieldClass="sidebar-bg rounded-none border-0 border-l focus-within:border-0 focus-within:border-l focus-within:sidebar-inner-border sidebar-inner-border focus-within:ring-0"
        buttonsClass="sidebar-bg sidebar-inner-border"
        placeholder="Type a note to yourself..."
        bind:value={$note}
        on:input={(event) => notifyOtherSetters(event.detail[0])}
        on:value-setter={(event) => setters.add(event.detail)}
        on:remove-value-setter={(event) => setters.delete(event.detail)}
      />
    {:else if $isTodosOpen}
      <Todo borderless sidebarBg class="flex-1 border-l sidebar-inner-border" />
    {:else if $isThemeOpen}
      <ThemeEditor class="flex-1 border-l sidebar-inner-border" />
    {:else if $isActivityOpen}
      <Activity class="flex-1 border-l sidebar-inner-border" />
    {/if}
  {/if}

  <div
    class="flex-1 overflow-auto border-l py-3 px-4 sidebar-inner-border desc-[h2]:mb-2 desc-[h2]:mt-6 desc-[p]:mt-2 desc-[ul]:ml-6 desc-[ul]:mt-2 desc-[ul]:list-disc desc-[li]:pl-1 desc-[h2]:font-semibold desc-[h2]:text-heading"
    class:hidden={!$isHelpOpen}
  >
    <h2 style:margin-top="0">Help</h2>

    <div id="help" />

    <h2>About the Sidebar</h2>

    <p>This menu will update based on the contents of the current page.</p>
  </div>
</div>

<button
  class="fixed bottom-2 z-40 origin-[right,center] {$isSidebarOpen &&
  $isThemeOpen
    ? 'right-[37rem]'
    : $isSidebarOpen && ($isHelpOpen || $isActivityOpen)
    ? 'right-[27rem]'
    : isFullyOpen
    ? 'right-84'
    : $isSidebarOpen
    ? 'right-2'
    : '-right-5 hover:right-0 sharp:-right-4'} hidden h-10 md:flex {$isSidebarOpen
    ? 'w-10'
    : 'w-12'} items-center {$isSidebarOpen
    ? 'rounded-full'
    : 'rounded-l-full'} border border-r-transparent dark:border-r-transparent {$isSidebarOpen
    ? ''
    : 'border-r-0'} {$isSidebarOpen
    ? 'pl-3'
    : 'pl-2.5'} ring-color select-none outline-none transition-all hover:pl-3 focus:ring"
  class:animate-new={/* replace with something once we need it */ false}
  class:bg-field={!$isSidebarOpen}
  class:border-standard={!$isSidebarOpen}
  class:border-transparent={$isSidebarOpen}
  class:sidebar-button-color={$isSidebarOpen}
  class:text-field={!$isSidebarOpen}
  class:hover:sidebar-button-hover-bg={$isSidebarOpen}
  class:hover:sidebar-button-hover-color={$isSidebarOpen}
  on:click={() => isSidebarOpen.update(($open) => !$open)}
>
  <Icon
    class="h-3 w-3"
    icon={$isSidebarOpen ? faChevronRight : faChevronLeft}
  />
</button>
