<script lang="ts">
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LargeTitle from "$lib/LargeTitle.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import {
    Label,
    labelToSortPrecedence,
    statusToLabel,
  } from "$lib/statusToLabel"
  import Table from "$lib/Table.svelte"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faPercent,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ assignment } = data)
  $: files = assignment.attachments.filter((e) => e.type == "File")
  $: links = assignment.attachments.filter((e) => e.type == "Link")
  $: groups = assignment.groups.map((group) => group.title)

  $: labels = Object.entries(
    assignment.statuses
      .map((status) => statusToLabel(status, assignment))
      .reduce<Partial<Record<Label, number>>>((record, label) => {
        if (label in record) {
          record[label]!++
        } else {
          record[label] = 1
        }

        return record
      }, {})
  ).sort(
    ([a], [b]) =>
      labelToSortPrecedence(a as Label) - labelToSortPrecedence(b as Label)
  )
</script>

<Title mode="head-only" title={assignment.title} />

<div class="flex flex-1 flex-col gap-8 lg:flex-row">
  <div class="top-22 flex flex-1 flex-col self-start lg:sticky">
    <div class="prose">
      <LargeTitle>{assignment.title}</LargeTitle>

      <IconLabels class="mb-4">
        <IconLabel
          content={toDateString(new Date(assignment.due))}
          icon={faCalendarCheck}
          title="Due date:"
        />

        <IconLabel
          content={groups.length == 1 ? groups[0] : `${groups.length} groups`}
          icon={faUserGroup}
          title="Published in group:"
        />

        {#if assignment.points != 0}
          <IconLabel
            content="{assignment.points} point{assignment.points == 1
              ? ''
              : 's'}"
            icon={faPercent}
            title="Number of points:"
          />
        {/if}
      </IconLabels>

      {@html assignment.description}
    </div>

    {#if files.length > 0 || links.length > 0}
      <div class="mt-12 flex w-full flex-col gap-6 sm:flex-row md:gap-4">
        {#if files.length > 0}
          <div class="flex-1">
            <p class="mb-2">Attachments:</p>

            <div class="field-group max-w-xs">
              {#each files as file}
                <LinkedObject interactive object={file} />
              {/each}
            </div>
          </div>
        {/if}

        {#if links.length > 0}
          <div class="flex-1">
            <p class="mb-2">Links:</p>

            <div class="field-group max-w-xs">
              {#each links as link}
                <LinkedObject interactive object={link} />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div
    class="field-group prefer-w-xl top-22 mx-auto self-start lg:sticky lg:mx-0"
  >
    <p class="mb-2 px-3">Assigned to:</p>

    {#if assignment.statuses.length == 0}
      <div>No assignees found.</div>
    {:else}
      <Table highlightFirst>
        <div class="flex rounded-md px-3 py-1">
          <p class="w-1/2">{assignment.statuses.length}</p>

          <p class="w-1/2 text-left">Total</p>
        </div>

        {#each labels as [label, count]}
          <div class="flex rounded-md px-3 py-1">
            <p class="w-1/2">{count}</p>

            <p class="w-1/2 text-left">{label}</p>
          </div>
        {/each}
      </Table>
    {/if}

    <a
      class="link mt-2 block px-3"
      href="/assignment/manage/{assignment.id}/grades"
    >
      View Submissions
    </a>
  </div>
</div>
