<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import { toDateString } from "$lib/toDateString"
  import { createEventDispatcher } from "svelte"
  import type { ActivityPost, ArchiveData } from "./Activity.svelte"

  const emit = createEventDispatcher<{ post: ActivityPost }>()

  export let data: ArchiveData
</script>

{#each data.activities as activity}
  <button
    class="border-b py-3 px-4 sidebar-inner-border last:border-b-0"
    on:click={() => emit("post", { type: "reload", id: activity.id })}
  >
    <p class="text-left">{activity.title}</p>

    <p class="text-right text-sm text-label">
      {toDateString(new Date(activity.creation))}
    </p>
  </button>
{:else}
  <p class="mx-auto mt-auto">
    {PUBLIC_KS_APP_NAME} doesn't have any activities yet.
  </p>

  <p class="mx-auto mb-auto">Check back tomorrow!</p>
{/each}
