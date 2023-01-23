<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
  import { help } from "$lib/help"
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
  import { assign } from "svelte/internal"
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ status } = data)
  $: ({ assignment } = status)
  $: body = status.body
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
          href={group && `/group/${group.id}`}
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
    <div class="field-group mb-12">
      <div class="field flex items-center">
        <p class="text-label">Assignment status:</p>

        <!-- TODO: Add missing indicator. -->

        <div
          class="relative -my-2 mr-[calc(0.75rem_-_1px)] ml-auto h-10 w-6 bg-gradient-to-r from-bg-field before:-top-px bafter:absolute bafter:-bottom-px bafter:left-0 bafter:h-px bafter:w-full bafter:bg-gradient-to-r bafter:from-border-standard bafter:content-['_'] {color ==
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
          class="relative -right-px -top-px -mx-3 -mt-2 mb-[calc(-0.5rem_-_2px)] h-[calc(100%_+_2px)] {status.score ==
          null
            ? 'rounded-r-lg'
            : 'rounded-tr-lg'} border border-l-0 py-2 pl-1 pr-4 {color ==
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

      {#if status.score != null}
        <div class="field flex items-center gap-1">
          <span class="text-label">Grade:</span>
          <span>{status.score} of {assignment.points}</span>
        </div>
      {/if}
    </div>

    <form
      class="flex w-full flex-col"
      method="post"
      use:enhance={() =>
        ({ update }) =>
          update({ reset: false })}
    >
      <div
        class="focus:z-10"
        class:-mb-[0.375em]={!browser &&
          status.submitted == null &&
          !(status.submitted && new Date() > status.due)}
      >
        <RichTextArea
          class="rounded-bl-lg"
          name="body"
          placeholder="Type a submission..."
          readonly={status.submitted != null}
          value={body}
        />
      </div>

      <div class="flex w-full justify-evenly">
        {#if status.submitted}
          <button
            class="field prefer-w-40 rounded-t-none border-t-0 focus:-mt-px"
            type="submit"
            formaction="?/unsubmit"
          >
            Unsubmit
          </button>
        {:else}
          <button
            class="field prefer-w-40 rounded-t-none border-t-0 focus:-mt-px"
            type="submit"
            formaction="?/draft"
          >
            Save Draft
          </button>

          <button
            class="field prefer-w-40 rounded-t-none border-t-0 focus:-mt-px"
            type="submit"
            formaction="?/submit"
          >
            Submit
          </button>
        {/if}
      </div>

      {#if status.teacherComment}
        <div class="prose mt-4 w-full">
          <p>Your teacher said:</p>
          {@html status.teacherComment}
        </div>
      {/if}
    </form>
  </div>
</div>

<div hidden use:help>
  <p>This page is the student view of an assignment.</p>

  <p>The left side of the screen includes the</p>

  <ul>
    <li>assignment title,</li>
    <li>due date,</li>
    <li>group,</li>
    <li>point value,</li>
    <li>description, and</li>
    <li>attachments.</li>
  </ul>

  <h2>Submitting Work</h2>

  <p>The right side of the screen includes your submission.</p>

  <p>
    You can save a draft of your submission. Your teacher will not see this
    draft until you submit the assignment.
  </p>

  <p>
    If you submit your assignment after the due date, it will be marked as
    "Late." Your teacher can see this.
  </p>

  <p>
    You may unsubmit your assignment and return it to a draft at any time. If
    you unsubmit it after the deadline, however, it may be marked as "Late" or
    "Overdue."
  </p>

  <h2>Special Statuses</h2>

  <p>
    Your teacher can mark an assignment as missing. At the moment, being marked
    as missing does nothing. This will change in the future.
  </p>

  <p>
    They can also mark it as exempt. This means it won't count towards your
    grade and you don't need to submit anything.
  </p>
</div>
