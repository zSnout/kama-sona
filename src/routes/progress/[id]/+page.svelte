<script lang="ts">
  import { count } from "$lib/count"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import { Color, statusToColor, statusToLabel } from "$lib/statusToLabel"
  import Title from "$lib/Title.svelte"
  import { faComment } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"
  import type { PageData } from "./$types"
  import HeaderItem from "./HeaderItem.svelte"
  import HeaderItemLike from "./HeaderItemLike.svelte"

  export let data: PageData

  let filter: undefined | "exempt" | "graded" | "late" | "missing" = undefined

  function isLate(assignment: (typeof data.group.assignments)[number]) {
    if (assignment.status.exempt || new Date() < assignment.status.due) {
      // If we're exempt or the assignment isn't due yet, return false
      return false
    }

    return (
      // If the assignment wasn't submitted or
      assignment.status.submitted == null ||
      // was submitted after the due date,
      assignment.status.due < assignment.status.submitted
      // return true.
    )
  }

  $: assignments = data.group.assignments.filter((assignment) => {
    if (filter == "exempt") {
      return assignment.status.exempt
    } else if (filter == "graded") {
      return assignment.status.score != null
    } else if (filter == "late") {
      return isLate(assignment)
    } else if (filter == "missing") {
      return assignment.status.missing
    } else {
      return true
    }
  })

  let showFeedback = writable("progress:show-feedback", false)
</script>

<Title title={data.group.title} />

<div class="sticky top-20 z-10 flex rounded-lg pl-3 text-lg shadow-md bg-field">
  <p class="mr-auto py-2">
    {(data.group.grade.ratio * 100).toFixed(2)}<span
      class="text-sm font-medium text-label">%</span
    >
  </p>

  <div class="flex flex-wrap">
    <HeaderItem
      count={count(
        data.group.assignments,
        (assignment) => assignment.status.missing
      )}
      bind:filter
      type="missing"
    />

    <HeaderItem
      count={count(data.group.assignments, isLate)}
      bind:filter
      type="late"
    />

    <HeaderItem
      count={count(
        data.group.assignments,
        (assignment) => assignment.status.score != null
      )}
      bind:filter
      type="graded"
    />

    <HeaderItem
      count={count(
        data.group.assignments,
        (assignment) => assignment.status.exempt
      )}
      bind:filter
      type="exempt"
    />

    <HeaderItemLike
      active={$showFeedback}
      on:click={() => ($showFeedback = !$showFeedback)}
      tooltip="Show feedback"
    >
      <Icon class="ml-0.5 h-4 w-4" icon={faComment} />
    </HeaderItemLike>
  </div>
</div>

<div
  class="mx-auto mt-4 flex flex-1 flex-col"
  class:prefer-w-4xl={!$showFeedback}
  class:prefer-w-full={$showFeedback}
>
  {#each assignments as assignment}
    {@const statusLabel =
      (assignment.status.missing ? "Missing, " : "") +
      statusToLabel(assignment.status, assignment)}

    {@const color = assignment.status.missing
      ? Color.Red
      : statusToColor(assignment.status, assignment)}

    {@const showGrade =
      !assignment.status.exempt &&
      assignment.points != 0 &&
      assignment.status.score != null}

    {@const label = assignment.status.exempt
      ? "Exempt"
      : !assignment.status.submitted
      ? "Not submitted yet"
      : assignment.points == 0
      ? "Completed"
      : assignment.status.score == null
      ? "Not graded yet"
      : `${assignment.status.score} of ${assignment.points}`}

    <a
      class="group flex flex-wrap gap-x-4 gap-y-1 pb-3 min-[583px]:pb-1"
      href="/assignment/{assignment.status.id}"
    >
      {#if assignment.status.teacherComment}
        <Icon
          class="relative top-1.5 -mr-px h-3 w-3 text-label"
          icon={faComment}
        />
      {:else}
        <div class="-mr-px h-3 w-3" />
      {/if}

      <div
        class="{color == Color.Green
          ? 'bg-green-500'
          : color == Color.Purple
          ? 'bg-purple-500'
          : color == Color.Red
          ? 'bg-red-500'
          : color == Color.Yellow
          ? 'bg-yellow-500'
          : ''} group-tooltip relative top-1.5 h-3 w-3 rounded-full before:whitespace-nowrap"
        data-tooltip={statusLabel}
      />

      <p
        class="overflow-clip text-ellipsis whitespace-nowrap underline-offset-2 group-hover:underline"
        class:w-56={!$showFeedback}
        class:w-48={$showFeedback}
      >
        {assignment.title}
      </p>

      <div
        class="relative flex h-6 min-w-[16rem] flex-1 rounded-md bg-chart"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={assignment.status.score}
        aria-valuetext={label}
      >
        {#if !$showFeedback && assignment.status.teacherComment}
          <div
            class="tooltip html-tooltip prefer-w-[calc(100%_-_4rem)] group-hover:scale-100 group-hover:opacity-100"
          >
            {@html assignment.status.teacherComment}
          </div>
        {/if}

        {#if showGrade}
          <div
            class="h-full rounded-md bg-chart-active"
            style:width="{Math.min(
              Math.max(
                0,
                (100 * (assignment.status.score || 0)) / assignment.points
              ),
              100
            )}%"
          />
        {/if}

        <p
          class="absolute top-0 left-0 ml-2 whitespace-nowrap"
          class:text-chart-active={showGrade && assignment.status.score != 0}
        >
          {label}
        </p>
      </div>

      {#if $showFeedback}
        <div class="w-[calc(100%_-_45rem)] min-w-[16rem]">
          {@html assignment.status.teacherComment}
        </div>
      {/if}
    </a>
  {:else}
    <p class="my-auto text-center">
      {data.group.assignments.length == 0 || filter == null
        ? data.group.title + " doesn't have any assignments yet."
        : "None of your assignments are " + filter + "."}
    </p>
  {/each}
</div>

<div hidden use:help>
  <p>This page shows your grades in a particular group.</p>

  <h2>Overview</h2>

  <p>
    Each row contains a colored circle, the assignment title, and a progress bar
    showing your grade for that assignment.
  </p>

  <p>
    A row may also start with a <Icon
      class="mr-0"
      isLabel
      icon={faComment}
      title="comment"
    /> icon. This indicates that your teacher has left a comment on your assignment.
  </p>
</div>
