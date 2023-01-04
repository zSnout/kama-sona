<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LargeTitle from "$lib/LargeTitle.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import { Color, statusToColor, statusToLabel } from "$lib/statusToLabel"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faPercent,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ status } = data)
  $: ({ assignment } = status)
  $: group = assignment.groups[0]
  $: files = assignment.attachments.filter((e) => e.type == "File")
  $: links = assignment.attachments.filter((e) => e.type == "Link")
  $: label = statusToLabel(status, assignment)
  $: color = statusToColor(status, assignment)
</script>

<Title mode="head-only" title={assignment.title} />

<div class="flex flex-1 flex-col gap-8 lg:flex-row">
  <div class="top-22 flex flex-1 flex-col self-start lg:sticky">
    <div class="prose">
      <LargeTitle>{assignment.title}</LargeTitle>

      <IconLabels class="mb-4">
        <IconLabel
          class={!status.submitted && new Date() > status.due
            ? "red text-red-700 dark:text-red-500"
            : ""}
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

  <div class="prefer-w-xl top-22 mx-auto self-start lg:sticky lg:mx-0">
    <div class="field-group">
      <div class="field mb-12 flex items-center">
        <p class="text-gray-500 dark:text-gray-400">Assignment status:</p>

        <!-- TODO: Add missing and exempt indicators. -->

        <div
          class="relative -my-2 mr-[calc(0.75rem_-_1px)] ml-auto h-10 w-6 bg-gradient-to-r from-white before:-top-[1px] bafter:absolute bafter:-bottom-[1px] bafter:left-0 bafter:h-[1px] bafter:w-full bafter:bg-gradient-to-r bafter:from-gray-300 bafter:content-['_'] dark:from-slate-850 dark:bafter:from-slate-600 {color ==
          Color.Red
            ? 'to-red-200 bafter:to-red-500 dark:to-red-900 dark:bafter:to-red-500'
            : color == Color.Green
            ? 'to-green-200 bafter:to-green-500 dark:to-green-900 dark:bafter:to-green-500'
            : color == Color.Yellow
            ? 'to-yellow-200 bafter:to-yellow-500 dark:to-yellow-900 dark:bafter:to-yellow-500'
            : 'to-purple-200 bafter:to-purple-500 dark:to-purple-900 dark:bafter:to-purple-500'}"
          aria-hidden="true"
        />

        <p
          class="relative -right-[1px] -top-[1px] -mx-3 -mt-2 mb-[calc(-0.5rem_-_2px)] h-[calc(100%_+_2px)] rounded-r-lg border border-l-0 py-2 pl-1 pr-4 {color ==
          Color.Red
            ? 'border-red-500 bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'
            : color == Color.Green
            ? 'border-green-500 bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200'
            : color == Color.Yellow
            ? 'border-yellow-500 bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200'
            : 'border-purple-500 bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200'}"
        >
          {label}
        </p>
      </div>
    </div>

    <form class="flex w-full flex-col" method="post" use:enhance>
      <div
        class="focus-within:z-10"
        class:-mb-[0.375em]={!browser &&
          !(status.submitted && new Date() > status.due)}
      >
        <RichTextArea
          class="rounded-bl-lg"
          name="description"
          placeholder="Type a description for your submission..."
          readonly={status.submitted != null}
          value={status.body}
        />
      </div>

      <div class="flex w-full justify-evenly">
        {#if status.submitted}
          {#if new Date() < status.due}
            <button
              class="field prefer-w-40 rounded-t-none border-t-0 focus-within:-mt-[1px]"
              type="submit"
              formaction="?/unsubmit"
            >
              Unsubmit
            </button>
          {/if}
        {:else}
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
        {/if}
      </div>
    </form>
  </div>
</div>
