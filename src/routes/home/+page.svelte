<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import Title from "$lib/Title.svelte"
  import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
  import Clock from "./features/Clock.svelte"
  import Note from "./features/Note.svelte"
  import OtherApps from "./features/Apps.svelte"
  import QuickActions from "./features/QuickActions.svelte"
  import Todo from "./features/Todo.svelte"
  import { layout } from "./layout"
</script>

<Title title={PUBLIC_KS_APP_NAME} mode="head-only" />

<div
  class="flex min-h-[max(100vh_-_7rem,544px_+_4rem)] grid-cols-3 flex-col gap-4 md:grid md:max-h-[max(100vh_-_7rem,544px_+_4rem)] md:flex-1"
  style:grid-template-rows="repeat(4, minmax(136px, 1fr))"
>
  {#each $layout as feature}
    <svelte:component
      this={feature.name == "Apps"
        ? OtherApps
        : feature.name == "Clock"
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
