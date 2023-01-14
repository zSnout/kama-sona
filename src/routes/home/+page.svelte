<script lang="ts">
  import Clock from "./features/Clock.svelte"
  import Note from "./features/Note.svelte"
  import QuickActions from "./features/QuickActions.svelte"
  import Todo from "./features/Todo.svelte"
  import { layout } from "./layout"

  // export let data: PageData
</script>

<div
  class="grid flex-1 grid-cols-3 gap-4"
  style:max-height="max(100vh - 7rem, 544px + 4rem)"
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
</div>
