<script lang="ts" context="module">
  export interface BulletinItem {
    author: {
      id: string
      name: string
    }
    body: string
    creation: string | Date
    id: string
    title: string
  }
</script>

<script lang="ts">
  import { browser } from "$app/environment"
  import BulletinButton from "$lib/BulletinButton.svelte"
  import LoadingSpinner from "$lib/LoadingSpinner.svelte"
  import { toDateString } from "$lib/toDateString"
  import type { PageData } from "../$types"
  import { makeGridArea, type Feature } from "../layout"

  export let feature: Feature
  export let data: PageData

  let items: Promise<BulletinItem[]> = browser
    ? fetch("/home/bulletins").then((response) => response.json())
    : Promise.resolve([])

  let activeItem: BulletinItem | undefined
  let lastActiveItem: BulletinItem | undefined
</script>

<svelte:window
  on:keydown={(event) => {
    if (
      activeItem &&
      event.key === "Escape" &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      activeItem = undefined
      event.preventDefault()
    }
  }}
/>

<div
  class="relative -inset-x-1 -top-1 flex w-[calc(100%_+_0.5rem)] flex-row gap-4 overflow-x-auto px-1 pb-3 pt-1 scrollbar:hidden"
  style:grid-area={makeGridArea(feature)}
>
  {#await items}
    <LoadingSpinner class="m-auto" />
  {:then items}
    {#each items as item}
      <BulletinButton
        action={() => (lastActiveItem = activeItem = item)}
        body={item.body}
        title={item.title}
      />
    {:else}
      <p class="m-auto">
        There's nothing on the bulletin board yet. {#if data.permissions.includes("create:bulletin")}
          <a class="link" href="/create/bulletin">Create something.</a>
        {/if}
      </p>
    {/each}
  {/await}
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="pointer-events-none fixed inset-0 top-16 z-40 flex items-center justify-center px-4 backdrop-blur transition"
  class:opacity-0={!activeItem}
  class:pointer-events-none={!activeItem}
  on:click={() => (activeItem = undefined)}
>
  {#if lastActiveItem}
    <div
      class="flex h-[30rem] w-96 flex-col overflow-auto rounded-lg px-3 py-2 shadow-lg bg-field"
    >
      <p class="font-semibold">{lastActiveItem.title}</p>

      <p class="mb-2 text-right text-sm text-label">
        <a class="link-colorless" href="/directory/{lastActiveItem.author.id}"
          >{lastActiveItem.author.name}</a
        ><span class="mx-1">&middot;</span>{toDateString(
          new Date(lastActiveItem.creation)
        )}
      </p>

      <p>{lastActiveItem.body}</p>

      {#if lastActiveItem.author.id == data.id}
        <a
          on:click={(event) => {
            if (
              !confirm(
                "Are you sure you want to delete '" +
                  lastActiveItem?.title +
                  "'?"
              )
            ) {
              event.stopImmediatePropagation()
              event.preventDefault()
            }
          }}
          href="/bulletin/delete/{lastActiveItem.id}"
          class="link ml-auto mt-auto">Delete</a
        >
      {/if}
    </div>
  {/if}
</div>
