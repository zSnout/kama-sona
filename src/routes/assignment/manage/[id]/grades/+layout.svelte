<script lang="ts">
  import { browser } from "$app/environment"
  import { page } from "$app/stores"
  import Icon from "$lib/Icon.svelte"
  import { Color, statusToColor, statusToLabel } from "$lib/statusToLabel"
  import { faArrowLeft, faListCheck } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"
  import type { LayoutData } from "./$types"

  export let data: LayoutData
  $: ({ statuses } = data.assignment)

  let showingStatus = writable("showAssignmentStatusInTeacherView", false)
</script>

<div class="-mx-3 flex flex-1">
  <div
    class="fixed top-22 bottom-0 -my-6 w-60 self-start overflow-y-auto py-6 pb-12 pl-3 scrollbar:hidden"
  >
    <div class="sticky top-0 z-20 mx-3 mr-6 mb-4 flex gap-4">
      <a
        class="field h-10"
        href="/assignment/manage/{data.assignment.id}"
        data-tooltip="Back"
        aria-label="Back"
      >
        <Icon class="h-4 w-4" icon={faArrowLeft} />
      </a>

      {#if browser}
        <button
          aria-checked={$showingStatus}
          aria-label="Status"
          class="field ml-auto h-10"
          class:active={$showingStatus}
          role="checkbox"
          on:click={() => showingStatus.update((value) => !value)}
          data-tooltip="Status"
        >
          <Icon class="h-4 w-4" icon={faListCheck} />
        </button>
      {/if}
    </div>

    {#each statuses as status}
      {@const active = $page.params.statusId == status.id}
      {@const label = statusToLabel(status, data.assignment)}
      {@const color = statusToColor(status, data.assignment)}

      <a
        class="ring-color relative mr-4 flex flex-col rounded-lg border border-transparent px-3 py-1 outline-none transition focus-visible:ring"
        class:bg-white={active}
        class:dark:bg-slate-900={active}
        class:sticky={active}
        class:top-14={active}
        class:bottom-0={active}
        class:shadow-md={active}
        class:z-10={active}
        href={active
          ? `/assignment/manage/${data.assignment.id}/grades`
          : `/assignment/manage/${data.assignment.id}/grades/${status.id}`}
      >
        <p class="overflow-hidden text-ellipsis whitespace-nowrap">
          {status.assignee.name}
        </p>

        {#if status.missing}
          <p
            class="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-red-400 transition-all"
            class:h-5={$showingStatus}
            class:h-0={!$showingStatus}
          >
            Missing
          </p>
        {/if}

        <p
          class="overflow-hidden text-ellipsis whitespace-nowrap text-sm transition-all {color ==
          Color.Red
            ? 'text-red-400'
            : color == Color.Yellow
            ? 'text-yellow-500'
            : color == Color.Green
            ? 'text-green-500'
            : color == Color.Purple
            ? 'text-purple-400'
            : ''}"
          class:h-5={$showingStatus}
          class:h-0={!$showingStatus}
        >
          {label}
        </p>
      </a>
    {/each}
  </div>

  <div class="flex flex-1 flex-col pl-60 pr-3">
    <slot />
  </div>
</div>
