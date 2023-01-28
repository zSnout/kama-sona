<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import { pages, type CreateInfo } from "$lib/pages"
  import Title from "$lib/Title.svelte"
  import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"
  import Clock from "./features/Clock.svelte"
  import News from "./features/News.svelte"
  import Note from "./features/Note.svelte"
  import Todo from "./features/Todo.svelte"
  import { layout } from "./layout"
  import Spinner from "./Spinner.svelte"

  export let data: PageData

  const creatable = pages
    .filter(
      (page): page is typeof page & { create: CreateInfo } => !!page.create
    )
    .map((page) => ({
      color: page.color,
      href: "/create/" + page.create.type,
      title: page.create.singular,
      icon: page.icon,
      disabled: !data.permissions.includes(`create:${page.create.type}`),
    }))
</script>

<Title title={PUBLIC_KS_APP_NAME} mode="head-only" />

<div
  class="relative flex min-h-[max(100vh_-_7rem)] grid-cols-3 grid-rows-[repeat(4,minmax(100px,_1fr))] flex-col gap-4 md:grid md:max-h-[max(100vh_-_7rem)] md:flex-1 lg:grid-rows-[minmax(100px,1fr),minmax(100px,_1fr),3rem,minmax(100px,_1fr),minmax(100px,_1fr)]"
>
  {#each $layout as feature}
    <svelte:component
      this={feature.name == "Clock"
        ? Clock
        : feature.name == "News"
        ? News
        : feature.name == "Note"
        ? Note
        : feature.name == "Todo"
        ? Todo
        : undefined}
      {feature}
    />
  {/each}

  <Spinner
    items={pages}
    tooltip="All Apps"
    translate="-50px,0"
    class="grid grid-cols-3 grid-rows-3 items-center justify-items-center"
  >
    <svelte:fragment slot="icon">
      {#each Array(9) as _}
        <div
          class="pointer-events-none h-1.5 w-1.5 rounded-full bg-current big-button-icon group-hover:big-button-hover-icon"
        />
      {/each}
    </svelte:fragment>
  </Spinner>

  <Spinner items={creatable} tooltip="Create an Item" translate="50px,0">
    <svelte:fragment slot="icon">
      <Icon
        class="pointer-events-none h-8 w-8 transition big-button-icon group-hover:big-button-hover-icon"
        icon={faPlus}
      />
    </svelte:fragment>
  </Spinner>
</div>

<div class="mt-8 flex flex-wrap justify-center gap-4 lg:hidden">
  {#each pages as page}
    <BigButtonColored
      color={page.color}
      href={page.href}
      icon={page.icon}
      label={page.title}
    />
  {/each}
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
