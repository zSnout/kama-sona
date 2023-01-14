<script lang="ts">
  import Icon from "$lib/Icon.svelte"
  import { note, notifyOtherSetters, setters } from "$lib/noteStore"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import Todo from "$lib/Todo.svelte"
  import {
    faChevronLeft,
    faChevronRight,
    faNoteSticky,
    faTasks,
  } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"

  const isSidebarOpen = writable("sidebar:open", false)
  const isNotesOpen = writable("sidebar:open:notes", false)
  const isTodosOpen = writable("sidebar:open:todos", false)
  $: isFullyOpen = $isSidebarOpen && ($isNotesOpen || $isTodosOpen)

  $: sidebarItems = [
    {
      name: "Notes",
      icon: faNoteSticky,
      open: $isNotesOpen,
      onClick: () => {
        isNotesOpen.update(($open) => !$open)
        isTodosOpen.set(false)
      },
    },
    {
      name: "Todos",
      icon: faTasks,
      open: $isTodosOpen,
      onClick: () => {
        isNotesOpen.set(false)
        isTodosOpen.update(($open) => !$open)
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
    : '-right-[25rem]'} hidden h-full w-96 pt-16 shadow-horiz-lg transition-all bg-field lg:flex"
>
  <div class="flex h-full w-14 flex-col items-center pt-2">
    {#each sidebarItems as { name, icon, open, onClick }, index (name)}
      <button
        class="ring-color flex h-10 w-10 items-center justify-center rounded-full border border-transparent outline-none transition-all hover:bg-gray-200 focus:ring has-[+:hover]:rounded-b-none prev-[:hover]:rounded-t-none dark:hover:bg-slate-700"
        class:bg-gray-200={open}
        class:dark:bg-slate-700={open}
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
      fieldClass="rounded-none border-0 border-l focus-within:border-0 focus-within:border-l focus-within:border-standard focus-within:ring-0"
      placeholder="Type a note to yourself..."
      bind:value={$note}
      on:input={(event) => notifyOtherSetters(event.detail[0])}
      on:value-setter={(event) => setters.add(event.detail)}
      on:remove-value-setter={(event) => setters.delete(event.detail)}
    />
  {:else if $isTodosOpen}
    <Todo borderless class="flex-1 border-l border-standard" />
  {/if}
</div>

<button
  class="fixed bottom-2 {isFullyOpen
    ? 'right-84'
    : $isSidebarOpen
    ? 'right-2'
    : '-right-5 hover:right-0'} hidden h-10 lg:flex {$isSidebarOpen
    ? 'w-10'
    : 'w-12'} items-center {$isSidebarOpen
    ? 'rounded-full'
    : 'rounded-l-full'} border border-r-transparent dark:border-r-transparent {$isSidebarOpen
    ? ''
    : 'border-r-0'} {$isSidebarOpen
    ? 'border-transparent'
    : 'border-standard'} bg-field {$isSidebarOpen
    ? 'pl-3'
    : 'pl-2.5'} ring-color outline-none transition-all hover:pl-3 focus:ring"
  class:hover:bg-gray-200={$isSidebarOpen}
  class:hover:dark:bg-slate-700={$isSidebarOpen}
  on:click={() => isSidebarOpen.update(($open) => !$open)}
>
  <Icon
    class="h-3 w-3"
    icon={$isSidebarOpen ? faChevronRight : faChevronLeft}
  />
</button>
