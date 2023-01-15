<script lang="ts">
  import Clock from "./features/Clock.svelte"
  import Note from "./features/Note.svelte"
  import QuickActions from "./features/QuickActions.svelte"
  import Todo from "./features/Todo.svelte"
  import { layout } from "./layout"

  // export let data: PageData
</script>

<div
  class="flex min-h-[max(100vh_-_7rem,544px_+_4rem)] grid-cols-3 flex-col gap-4 md:grid md:max-h-[max(100vh_-_7rem,544px_+_4rem)] md:flex-1"
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
