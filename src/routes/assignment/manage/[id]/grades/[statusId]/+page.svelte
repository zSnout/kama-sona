<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
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
            <a
              class="link-colorless"
              href="/directory/{status.assignee.id}"
            >
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
          <form action="?/missing" method="post" use:enhance>
            <button
              class="field h-10 text-center"
              class:active={status.missing}
              type="submit"
              data-tooltip="Missing"
              aria-label="Missing"
            >
              <Icon
                class="relative left-[1px] h-5 w-5"
                icon={faFileCircleExclamation}
              />
            </button>
          </form>

          <form action="?/exempt" method="post" use:enhance>
            <button
              class="field h-10 text-center"
              class:active={status.exempt}
              type="submit"
              data-tooltip="Exempt"
              aria-label="Exempt"
            >
              <Icon class="relative left-[1px] h-5 w-5" icon={faThumbsUp} />
            </button>
          </form>
        </div>
      </div>

      {#if status.submitted}
        <div class="prefer-w-96">
          {@html status.body}
        </div>
      {:else}
        <p>{status.assignee.name} hasn't submitted this assignment yet.</p>
      {/if}
    </div>

    <div class="prefer-w-md">
      <form use:enhance method="post">
        <div class="relative focus-within:z-10" class:-mb-[0.375em]={!browser}>
          <RichTextArea
            class="rounded-bl-lg"
            name="comment"
            placeholder="Type a comment to {status.assignee.name}..."
            value={status.teacherComment}
          />
        </div>

        <div class="relative flex flex-row">
          <button
            class="field prefer-w-40 mx-auto rounded-t-none border-t-0 focus-within:-mt-[1px]"
            type="submit"
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  </div>
{:else}
  <Page {data} />
{/if}
