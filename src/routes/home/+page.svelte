<script lang="ts">
  import Clock from "./features/Clock.svelte"
  import Note from "./features/Note.svelte"
  import QuickActions from "./features/QuickActions.svelte"
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
        : undefined}
      {feature}
    />
  {/each}

  <!-- <div class="w-full bg-red-300" />
  <div class="w-full bg-sky-300" />
  <div class="w-full bg-green-300" />

  <div class="w-full bg-blue-300" />
  <div class="w-full bg-purple-300" />
  <div class="w-full bg-yellow-300" />

  <div class="w-full bg-fuchsia-300" />
  <div class="w-full bg-emerald-300" />
  <div class="w-full bg-orange-300" />

  <div class="w-full bg-lime-300" />
  <div class="w-full bg-pink-300" />
  <div class="w-full bg-teal-300" /> -->
</div>
