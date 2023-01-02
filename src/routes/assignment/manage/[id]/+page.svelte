<script lang="ts">
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
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
</script>

<Title mode="head-only" title={assignment.title} />

<div class="flex flex-1 flex-col gap-8 lg:flex-row">
  <div class="flex flex-1 flex-col">
    <div class="prose">
      <h1 class="mt-0 mb-2 border-0 pb-0">{assignment.title}</h1>

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

  <div class="prefer-w-xl mx-auto lg:mx-0">
    needs improvement:

    {#each assignment.statuses as status}
      <div>
        {status.assignee.name}
      </div>
    {:else}
      <div>No assignees</div>
    {/each}
  </div>
</div>
