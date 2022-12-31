<script lang="ts">
  import { browser } from "$app/environment"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import { sanitize } from "$lib/sanitize"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faPercent,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import { AttachmentType } from "@prisma/client"
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ status } = data)
  $: ({ assignment } = status)
  $: group = assignment.groups[0]
  $: files = assignment.attachments.filter((e) => e.type == AttachmentType.File)
  $: links = assignment.attachments.filter((e) => e.type == AttachmentType.Link)
</script>

<Title mode="head-only" title={assignment.title} />

<div class="flex flex-1 flex-col gap-8 lg:flex-row">
  <div class="flex flex-1 flex-col">
    <div class="prose">
      <h1 class="mt-0 mb-2 border-0 pb-0">{assignment.title}</h1>

      <IconLabels class="mb-4">
        <IconLabel
          content={toDateString(new Date(status.due))}
          icon={faCalendarCheck}
          title="Due date:"
        />

        <IconLabel
          content={group?.title || "Unknown group"}
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

      {@html sanitize(assignment.description)}
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
    <div class="field mb-12 flex items-center">
      <p class="text-gray-500">Assignment status:</p>

      <div
        class="relative -my-2 mr-[calc(0.75rem_-_1px)] ml-auto h-10 w-6 bg-gradient-to-r from-white before:-top-[1px] bafter:absolute bafter:-bottom-[1px] bafter:left-0 bafter:h-[1px] bafter:w-full bafter:bg-gradient-to-r bafter:from-gray-300 bafter:content-['_'] dark:from-slate-850 dark:bafter:from-slate-600 {status.missing
          ? 'to-red-200 bafter:to-red-500 dark:to-red-900 dark:bafter:to-red-500'
          : status.submitted
          ? 'to-green-200 bafter:to-green-500 dark:to-green-900 dark:bafter:to-green-500'
          : status.attachments.length > 0 || status.body.trim()
          ? 'to-yellow-200 bafter:to-yellow-500 dark:to-yellow-900 dark:bafter:to-yellow-500'
          : new Date() < status.due
          ? 'to-purple-200 bafter:to-purple-500 dark:to-purple-900 dark:bafter:to-purple-500'
          : 'to-red-200 bafter:to-red-500 dark:to-red-900 dark:bafter:to-red-500'}"
        aria-hidden="true"
      />

      <p
        class="relative -right-[1px] -top-[1px] -mx-3 -mt-2 mb-[calc(-0.5rem_-_2px)] h-[calc(100%_+_2px)] rounded-r-lg border border-l-0 py-2 pl-1 pr-4 {status.missing
          ? 'border-red-500 bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'
          : status.submitted
          ? 'border-green-500 bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200'
          : status.attachments.length > 0 || status.body.trim()
          ? 'border-yellow-500 bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200'
          : new Date() < status.due
          ? 'border-purple-500 bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200'
          : 'border-red-500 bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'}"
      >
        {status.missing
          ? "Missing"
          : status.submitted
          ? status.score != null && assignment.points != 0
            ? "Graded"
            : status.attachments.length > 0 || status.body.trim()
            ? "Submitted"
            : "Completed"
          : status.attachments.length > 0 || status.body.trim()
          ? "In Progress"
          : new Date() < status.due
          ? "To Do"
          : "Overdue"}
      </p>
    </div>

    <form class="flex w-full flex-col" method="post">
      <div
        class="focus-within:z-10"
        class:-mb-[0.375em]={!browser && !status.submitted}
      >
        <RichTextArea
          class="rounded-bl-lg"
          name="description"
          placeholder="Type a description for your submission..."
          readonly={status.submitted != null}
          value={status.body}
        />
      </div>

      <div class="w-full justify-evenly lg:flex">
        <button
          class="field prefer-w-40 rounded-t-none border-t-0 focus-within:-mt-[1px]"
          type="submit"
          formaction="?/draft"
        >
          Save Draft
        </button>

        <button
          class="field prefer-w-40 rounded-t-none border-t-0 focus-within:-mt-[1px]"
          type="submit"
          formaction="?/submit"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</div>
