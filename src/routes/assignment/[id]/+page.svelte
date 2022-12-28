<script lang="ts">
  import { browser } from "$app/environment"
  import Icon from "$lib/Icon.svelte"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faLink,
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

  function upload(file: File) {}
</script>

<Title mode="head-only" title={assignment.title} />

<div class="flex flex-1 flex-col gap-8 md:flex-row">
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

      {@html assignment.description}
    </div>

    {#if files.length > 0 || links.length > 0}
      <div class="flex w-full gap-4">
        {#if files.length > 0}
          <div class="flex-1">
            <p class="mt-12 mb-2">Attachments:</p>

            <div class="field-group">
              {#each files as file}
                <LinkedObject interactive object={file} />
              {/each}
            </div>
          </div>
        {/if}

        {#if links.length > 0}
          <div class="flex-1">
            <p class="mt-12 mb-2">Links:</p>

            <div class="field-group">
              {#each links as link}
                <LinkedObject interactive object={link} />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="prefer-w-xl ml-auto">
    <div class="field mb-8 flex items-center">
      <p class="text-gray-500">Assignment status:</p>

      <div
        class="relative -my-2 mr-[calc(0.75rem_-_1px)] ml-auto h-10 w-6 bg-gradient-to-r from-white before:-top-[1px] bafter:absolute bafter:-bottom-[1px] bafter:left-0 bafter:h-[1px] bafter:w-full bafter:bg-gradient-to-r bafter:from-gray-300 bafter:content-['_'] dark:from-slate-850 dark:bafter:from-slate-600 {status.missing
          ? 'Missing'
          : status.submitted
          ? status.score != null && assignment.points != 0
            ? 'Graded'
            : status.attachments.length > 0 || status.body.trim()
            ? 'Submitted'
            : 'Completed'
          : status.attachments.length > 0 || status.body.trim()
          ? 'In Progress'
          : new Date() < status.due
          ? 'To Do'
          : 'to-red-200 bafter:to-red-500 dark:to-red-900 dark:bafter:to-red-500'}"
        aria-hidden="true"
      />

      <p
        class="relative -right-[1px] -top-[1px] -mx-3 -mt-2 mb-[calc(-0.5rem_-_2px)] h-[calc(100%_+_2px)] rounded-r-lg border border-l-0 py-2 px-3 pl-1 {status.missing
          ? 'Missing'
          : status.submitted
          ? status.score != null && assignment.points != 0
            ? 'Graded'
            : status.attachments.length > 0 || status.body.trim()
            ? 'Submitted'
            : 'Completed'
          : status.attachments.length > 0 || status.body.trim()
          ? 'In Progress'
          : new Date() < status.due
          ? 'To Do'
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

    <form class="field-group w-full">
      <RichTextArea
        name="description"
        placeholder="Type a description for your submission..."
        value={status.body}
        readonly={status.submitted}
      />

      {#if !status.submitted}
        {#if browser}
          <label class="field mt-4 flex cursor-pointer items-center">
            <Icon class="top-0 mr-2" isLabel icon={faLink} />

            Click to upload files.

            <input
              multiple
              type="file"
              class="sr-only"
              on:change={(event) => {
                const field = event.currentTarget
                const { files } = field

                field.value = ""
                if (!files) {
                  return
                }

                for (const file of files) {
                  upload(file)
                }
              }}
            />
          </label>
        {:else}
          <p class="field mt-4">Enable JavaScript to upload files.</p>
        {/if}
      {/if}
    </form>
  </div>
</div>
