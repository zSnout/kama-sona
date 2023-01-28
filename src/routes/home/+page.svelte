<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import { pages, type PageType } from "$lib/pages"
  import Title from "$lib/Title.svelte"
  import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
  import Clock from "./features/Clock.svelte"
  import Note from "./features/Note.svelte"
  import QuickActions from "./features/QuickActions.svelte"
  import Todo from "./features/Todo.svelte"
  import { layout } from "./layout"

  let active = new Set<
    `${PageType}-click` | `${PageType}-hover` | "opener" | "opener"
  >()

  $: showApps = active.size > 0
</script>

<Title title={PUBLIC_KS_APP_NAME} mode="head-only" />

<div
  class="relative flex min-h-[max(100vh_-_7rem,544px_+_4rem)] grid-cols-3 flex-col gap-4 md:grid md:max-h-[max(100vh_-_7rem,544px_+_4rem)] md:flex-1"
  style:grid-template-rows="repeat(4, minmax(136px, 1fr))"
>
  {#each $layout as feature}
    <svelte:component
      this={feature.name == "Clock"
        ? Clock
        : feature.name == "Note"
        ? Note
        : feature.name == "QuickActions"
        ? QuickActions
        : feature.name == "Todo"
        ? Todo
        : undefined}
      {feature}
    />
  {/each}

  <div
    class="absolute inset-y-0 -inset-x-8 z-40 hidden backdrop-blur-lg transition duration-500 lg:block"
    class:pointer-events-none={!showApps}
    class:opacity-0={!showApps}
  />

  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    class="absolute top-1/2 left-1/2 z-40 flex h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
    class:pointer-events-none={!showApps}
    on:mouseleave={() => (active.delete("opener"), (active = active))}
  >
    <button
      class="group pointer-events-auto hidden h-12 w-12 cursor-pointer grid-cols-3 grid-rows-3 items-center justify-items-center rounded-lg border p-1 outline-none transition max-lg:hidden lg:grid"
      class:big-button-bg={!showApps}
      class:big-button-border={!showApps}
      class:big-button-hover-bg={showApps}
      class:big-button-hover-border={showApps}
      on:click={() => {
        if (active.has("opener")) {
          active.delete("opener")
        } else {
          active.add("opener")
        }

        active = active
      }}
      on:mouseover={() => (active.add("opener"), (active = active))}
    >
      {#each Array(9) as _}
        <div
          class="pointer-events-none h-1.5 w-1.5 rounded-full bg-current big-button-icon group-hover:big-button-hover-icon"
        />
      {/each}
    </button>

    {#each pages as page, index}
      {@const angle = index * (360 / pages.length)}

      {@const reverseAngle =
        angle < 45
          ? 0
          : angle < 135
          ? 270
          : angle < 225
          ? 180
          : angle < 315
          ? 90
          : 0}

      {@const delay = index * 50}

      <BigButtonColored
        class="app-button-no-transform-small-screen absolute top-1/2 left-1/2 w-32 max-w-[8rem] {angle} z-40 hidden lg:flex {showApps
          ? 'active'
          : 'pointer-events-none opacity-0'} home-big-button"
        style="--angle: {angle}deg; --reverse-angle: {reverseAngle}deg; --delay: {delay}ms"
        color={page.color}
        href={page.href}
        icon={page.icon}
        label={page.title}
      />
    {/each}
  </div>
</div>

<div hidden use:help>
  <p>
    The home page contains a grid of features, including quick actions, a
    notepad, and a todo list.
  </p>

  <h2>Quick Actions</h2>

  <p>
    To create a new assignment, group, or resource, click the big button labeled
    "Create."
  </p>

  <p>
    To search through your current assignments, groups, and resources, click the
    big button labeled "Search."
  </p>

  <h2>Notepad</h2>

  <p>
    The notepad is a rich text editor and supports heading, lists, and text
    formatting.
  </p>

  <p>It supports some Google Docs, Word, and Markdown shortcuts.</p>

  <h2>Todo List</h2>

  <p>The todo list is a simple list of plain text items.</p>

  <p>
    To add a new item, type it into the field and press the <Icon
      class="mr-0"
      isLabel
      icon={faPlus}
      title="plus"
    /> icon.
  </p>

  <p>To check off an item, click it.</p>

  <p>
    To remove an item, hover over it and press the <Icon
      class="mr-0"
      isLabel
      icon={faTrash}
      title="trash"
    /> icon that appears to the right.
  </p>

  <p>Both your notepad and todo list are easily accessible from the sidebar.</p>
</div>
