<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance, type SubmitFunction } from "$app/forms"
  import { page } from "$app/stores"
  import Icon from "$lib/Icon.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import { Color, statusToColor, statusToLabel } from "$lib/statusToLabel"
  import Subtitle from "$lib/Subtitle.svelte"
  import Title from "$lib/Title.svelte"
  import {
    faFileCircleExclamation,
    faThumbsUp,
  } from "@fortawesome/free-solid-svg-icons"
  import Page from "../+page.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  $: status = data.assignment.statuses.find(
    (status) => status.id == $page.params.statusId
  )

  let isCommentDisabled = false
  let isExemptDisabled = false
  let isScoringDisabled = false
  let isMissingDisabled = false
</script>

{#if status}
  {@const label = statusToLabel(status, data.assignment)}
  {@const color = statusToColor(status, data.assignment)}

  <div class="flex flex-1">
    <div class="mr-4 flex-1">
      <div class="mb-4 flex">
        <div class="-mb-4">
          <Title title={data.assignment.title} />

          <Subtitle>
            <a class="link-colorless" href="/directory/{status.assignee.id}">
              {status.assignee.name}
            </a>

            <span class="mx-1 font-bold">&middot;</span>

            <span
              class={color == Color.Red
                ? "text-red-500"
                : color == Color.Yellow
                ? "text-yellow-600"
                : color == Color.Green
                ? "text-green-600"
                : color == Color.Purple
                ? "text-purple-500"
                : ""}>{label}</span
            >

            {#if status.missing}
              <span class="mx-1 font-bold">&middot;</span>

              <span class="text-red-400">Missing</span>
            {/if}
          </Subtitle>
        </div>

        <div class="field-group field-group-row ml-auto flex gap-4">
          <form
            action="?/missing"
            method="post"
            use:enhance={() => {
              isMissingDisabled = true

              return async ({ update }) => {
                await update({ reset: false })
                isMissingDisabled = false
              }
            }}
          >
            <button
              aria-checked={status.missing}
              aria-label="Missing"
              class="field h-10 text-center"
              class:active={status.missing}
              disabled={isMissingDisabled}
              role="checkbox"
              type="submit"
              data-tooltip="Missing"
            >
              <Icon
                class="relative left-[1px] h-5 w-5"
                icon={faFileCircleExclamation}
              />
            </button>
          </form>

          <form
            action="?/exempt"
            method="post"
            use:enhance={() => {
              isExemptDisabled = true

              return async ({ update }) => {
                await update({ reset: false })
                isExemptDisabled = false
              }
            }}
          >
            <button
              aria-checked={status.exempt}
              aria-label="Exempt"
              class="field h-10 text-center"
              class:active={status.exempt}
              disabled={isExemptDisabled}
              role="checkbox"
              type="submit"
              data-tooltip="Exempt"
            >
              <Icon class="relative left-[1px] h-5 w-5" icon={faThumbsUp} />
            </button>
          </form>
        </div>
      </div>

      {#if status.submitted}
        <div class="prose prefer-w-96">
          {@html status.body}
        </div>
      {:else}
        <p>{status.assignee.name} hasn't submitted this assignment yet.</p>
      {/if}
    </div>

    <div class="prefer-w-md">
      <form
        use:enhance={() => {
          isCommentDisabled = true

          return ({ update }) => {
            isCommentDisabled = false
            return update({ reset: false })
          }
        }}
        method="post"
        action="?/comment"
      >
        <div class="relative focus:z-10" class:-mb-[0.375em]={!browser}>
          <RichTextArea
            class="rounded-bl-lg"
            name="comment"
            placeholder="Type a comment to {status.assignee.name}..."
            value={status.teacherComment}
          />
        </div>

        <div class="relative flex flex-row">
          <button
            disabled={isCommentDisabled}
            class="field prefer-w-40 mx-auto rounded-t-none border-t-0 focus:-mt-[1px]"
            type="submit"
          >
            Add Comment
          </button>
        </div>
      </form>

      {#if data.assignment.points != 0}
        <form
          use:enhance={({ action }) => {
            isScoringDisabled = true

            return ({ update }) => {
              isScoringDisabled = false

              return update({ reset: action.search == "?/clearScore" })
            }
          }}
          action="?/score"
          class="mt-8 flex w-full flex-col"
          method="post"
        >
          <label class="label w-full">
            <p>
              {#if status.exempt}
                Students exempt from an assignment cannot be graded.
              {:else}
                Grade (out of {data.assignment.points} point{data.assignment
                  .points == 1
                  ? ""
                  : "s"}):
              {/if}
            </p>

            <input
              class="field w-full"
              min="0"
              max={data.assignment.points * 2}
              name="score"
              type="number"
              value={status.score}
              placeholder="Not graded yet"
              required={!status.exempt}
              disabled={status.exempt}
            />
          </label>

          <div class="flex gap-6">
            <button
              class="field mt-6 w-full"
              disabled={status.exempt || isScoringDisabled}
            >
              {status.score == null ? "Save" : "Change"} Grade
            </button>

            <button
              class="field mt-6 w-full"
              disabled={status.exempt || isScoringDisabled}
              formaction="?/clearScore"
            >
              Clear Grade
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{:else}
  <Page {data} />
{/if}
