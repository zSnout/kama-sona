<script lang="ts">
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
    faTasks,
  } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"

  const isSidebarOpen = writable("sidebar:open", false)
  const isNotesOpen = writable("sidebar:open:notes", false)
  const isTodosOpen = writable("sidebar:open:todos", false)
  const isThemeOpen = writable("sidebar:open:theme", false)

  $: isFullyOpen =
    $isSidebarOpen && ($isNotesOpen || $isTodosOpen || $isThemeOpen)

  $: sidebarItems = [
    {
      name: "Notes",
      icon: faNoteSticky,
      open: $isNotesOpen,
      onClick: () => {
        isNotesOpen.update(($open) => !$open)
        isTodosOpen.set(false)
        isThemeOpen.set(false)
      },
    },
    {
      name: "Todos",
      icon: faTasks,
      open: $isTodosOpen,
      onClick: () => {
        isNotesOpen.set(false)
        isTodosOpen.update(($open) => !$open)
        isThemeOpen.set(false)
      },
    },
    {
      name: "Theme Editor",
      icon: faPalette,
      open: $isThemeOpen,
      onClick: () => {
        isNotesOpen.set(false)
        isTodosOpen.set(false)
        isThemeOpen.update(($open) => !$open)
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
    : '-right-[25rem]'} prefer-w-96 z-40 hidden h-full select-none border-l pt-16 shadow-horiz-lg transition-all sidebar-bg sidebar-border-l md:flex"
  class:prefer-w-[40rem]={$isThemeOpen && $isSidebarOpen}
>
  <div class="flex h-full w-14 flex-col items-center pt-2">
    {#each sidebarItems as { name, icon, open, onClick }}
      <button
        class="ring-color flex h-10 w-10 items-center justify-center rounded-full border border-transparent outline-none transition sidebar-button-color hover:sidebar-button-hover-bg hover:sidebar-button-hover-color focus:ring"
        class:sidebar-button-hover-bg={open}
        class:sidebar-button-hover-color={open}
        on:click={onClick}
        aria-label="Toggle {name}"
      >
        <Icon class="h-5 w-5" {icon} />
      </button>
    {/each}
  </div>

  <!-- Useful classes for a generic container: h-full flex-1 border-l border-standard -->

  {#if $isNotesOpen}
    <RichTextArea
      class="resize-none"
      fieldClass="sidebar-bg rounded-none border-0 border-l focus-within:border-0 focus-within:border-l focus-within:border-standard focus-within:ring-0"
      buttonsClass="sidebar-bg"
      placeholder="Type a note to yourself..."
      bind:value={$note}
      on:input={(event) => notifyOtherSetters(event.detail[0])}
      on:value-setter={(event) => setters.add(event.detail)}
      on:remove-value-setter={(event) => setters.delete(event.detail)}
    />
  {:else if $isTodosOpen}
    <Todo borderless sidebarBg class="flex-1 border-l border-standard" />
  {:else if $isThemeOpen}
    <ThemeEditor class="flex-1 border-l border-standard" />
  {/if}
</div>

<button
  class="fixed bottom-2 z-40 {$isSidebarOpen && $isThemeOpen
    ? 'right-[37rem]'
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
  class:bg-field={!$isSidebarOpen}
  class:border-standard={!$isSidebarOpen}
  class:border-transparent={$isSidebarOpen}
  class:sidebar-button-color={$isSidebarOpen}
  class:hover:sidebar-button-hover-bg={$isSidebarOpen}
  class:hover:sidebar-button-hover-color={$isSidebarOpen}
  on:click={() => isSidebarOpen.update(($open) => !$open)}
>
  <Icon
    class="h-3 w-3"
    icon={$isSidebarOpen ? faChevronRight : faChevronLeft}
  />
</button>
