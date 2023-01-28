<script lang="ts">
  import { browser } from "$app/environment"
  import LoadingSpinner from "$lib/LoadingSpinner.svelte"
  import {
    isActivityOpen,
    isHelpOpen,
    isNotesOpen,
    isSidebarOpen,
    isThemeOpen,
    isTodosOpen,
  } from "../../../routes/Sidebar.svelte"
  import { makeGridArea, type Feature } from "../layout"
  import type { NewsItem } from "../news/+server"

  export let feature: Feature

  const request = browser
    ? fetch("/home/news").then<NewsItem[]>((response) => response.json())
    : []
</script>

<div
  class="flex flex-col overflow-auto px-4 py-1"
  style:grid-area={makeGridArea(feature)}
>
  {#await request}
    <LoadingSpinner class="m-auto" />
  {:then news}
    {#each news as item}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <svelte:element
        this={item.href == "activity" ? "button" : "a"}
        class="flex gap-x-3 gap-y-1 underline underline-offset-2 decoration-transparent hover:decoration-current transition py-1 first:pt-0 last:pb-0"
        href={item.href}
        on:click={() => {
          if (item.href == "activity") {
            isSidebarOpen.set(true)
            isHelpOpen.set(false)
            isNotesOpen.set(false)
            isTodosOpen.set(false)
            isThemeOpen.set(false)
            isActivityOpen.set(true)
          }
        }}
      >
        <div
          class="{item.color == 'red'
            ? 'bg-red-500'
            : item.color == 'orange'
            ? 'bg-orange-500'
            : item.color == 'yellow'
            ? 'bg-yellow-500'
            : item.color == 'green'
            ? 'bg-green-500'
            : item.color == 'blue'
            ? 'bg-blue-500'
            : item.color == 'purple'
            ? 'bg-purple-500'
            : ''} group-tooltip relative top-1.5 h-3 w-3 rounded-full before:whitespace-nowrap"
        />

        <p>{item.title}</p>
      </svelte:element>
    {:else}
      <p class="m-auto">No news today!</p>
    {/each}
  {/await}
</div>
