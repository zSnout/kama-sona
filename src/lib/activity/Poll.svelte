<script lang="ts">
  import Icon from "$lib/Icon.svelte"
  import { toDateString } from "$lib/toDateString"
  import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
  import { createEventDispatcher, onMount } from "svelte"
  import type { ActivityPost, PollData } from "./Activity.svelte"

  const emit = createEventDispatcher<{ post: ActivityPost }>()

  export let data: PollData
  $: totalVotes = data.options.reduce((acc, { votes }) => acc + votes, 0)

  let comment = ""
  let headerHeight = 0
  let commentEl: HTMLTextAreaElement

  function resizeCommentBox() {
    const { style } = commentEl
    style.height = style.minHeight = "0"
    style.height = style.minHeight = commentEl.scrollHeight + 2 + "px"
  }

  onMount(resizeCommentBox)
</script>

<div
  class="sticky top-0 z-50 -ml-px flex w-full flex-col self-start border-l py-3 px-4 sidebar-bg sidebar-inner-border"
  bind:offsetHeight={headerHeight}
>
  <div class="z-40 flex w-full flex-col">
    <p>{data.title}</p>

    {#if data.options.length}
      <div class="mb-2 flex justify-end text-right text-sm text-label">
        <p>
          {totalVotes} vote{totalVotes == 1 ? "" : "s"}
        </p>

        <p class="mx-1">&middot;</p>

        <button
          class="underline decoration-transparent underline-offset-2 transition hover:decoration-current"
          aria-label="Poll for {toDateString(
            new Date(data.creation)
          )}; click to show archive of activities"
          on:click={() => emit("post", { type: "Archive:retrieve" })}
        >
          {toDateString(new Date(data.creation))}
        </button>
      </div>
    {:else}
      <button
        class="ml-auto w-fit text-right text-sm italic underline decoration-transparent underline-offset-2 transition text-label hover:decoration-current"
        on:click={() => emit("post", { type: "Archive:retrieve" })}
        aria-label="Question for {toDateString(
          new Date(data.creation)
        )}; click to show archive of activities"
      >
        {toDateString(new Date(data.creation))}
      </button>
    {/if}

    {#each data.options as { title, votes }}
      {@const checked = data.myVote == title}

      <label
        class="group flex items-center gap-2 py-1 transition last:pb-0"
        class:opacity-30={!!data.myVote && !checked}
      >
        <div
          class="h-5 w-5 rounded-full bg-clip-content p-1 ring-1 transition group-focus:ring-[var(--border-focus)]"
          class:sidebar-bg={!checked}
          class:ring-[var(--border-standard)]={!checked}
          class:bg-[var(--border-focus)]={checked}
          class:ring-[var(--border-focus)]={checked}
        />

        <input
          {checked}
          class="sr-only"
          name="activity:poll"
          type="radio"
          on:input={() => {
            emit("post", {
              type: "Poll:select",
              optionTitle: title,
            })
          }}
          on:keydown={(event) => {
            if (
              !event.altKey &&
              !event.ctrlKey &&
              !event.metaKey &&
              event.key == "Backspace"
            ) {
              emit("post", {
                type: "Poll:select",
                optionTitle: "",
              })
            }
          }}
        />

        {title}

        {#if data.myVote}
          <span class="ml-auto text-sm text-label">
            {((100 * votes) / totalVotes).toFixed(0)}%
          </span>
        {/if}
      </label>
    {/each}
  </div>
</div>

<div
  class="sticky h-px min-h-[1px] w-full bg-[var(--sidebar-inner-border)]"
  style:top="{headerHeight}px"
/>

<form
  class="relative -ml-px -mt-px flex w-full"
  on:submit|preventDefault={() => {
    const body = comment.slice(0, 10000).trim()

    if (body) {
      emit("post", {
        type: "Poll:comment",
        body,
      })

      comment = ""
      resizeCommentBox()
    }
  }}
>
  <textarea
    class="peer relative min-h-[calc(3rem_+_2px)] flex-1 resize-none border bg-transparent px-4 py-3 outline-none transition border-standard placeholder:text-placeholder even:border-r-transparent focus:z-20 focus:ring-0 focus:focus:border-focus has-[+:hover]:border-r-[var(--border-hover)] has-[+:focus-visible]:border-r-[var(--border-focus)]"
    maxlength="10000"
    placeholder="Comment..."
    required
    rows="1"
    bind:this={commentEl}
    bind:value={comment}
    on:input={resizeCommentBox}
  />

  <button
    class="relative flex h-full w-12 items-center justify-center border-y outline-none transition border-standard hover:z-20 hover:bg-hover hover:border-hover focus:z-20 focus:border-focus"
    type="submit"
  >
    <Icon class="h-4 w-4" icon={faPaperPlane} />
  </button>
</form>

{#each data.comments as { author, body, vote }}
  <div class="mt-4 px-4 last:mb-4">
    <div class="flex items-baseline font-semibold">
      <p>{author}:</p>

      {#if vote}
        <p class="ml-auto text-xs font-normal italic text-label">
          (voted <span class="text-body">{vote}</span>)
        </p>
      {/if}
    </div>

    {#each body.split("\n") as line}
      <p class="pl-4">{line}</p>
    {/each}
  </div>
{/each}
