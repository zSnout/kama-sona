<script lang="ts">
  export let action: (() => void) | undefined = undefined
  export let title: string
  export let body: string

  const urlRegex = /(?:https?:\/\/)?(?:\w+\.)\w{2,7}[^.,'":;?!\s]*/g

  $: modded = body.replace(urlRegex, (match) => `||${match}||`)

  function trimURL(text: string) {
    if (text.startsWith("http://")) {
      text = text.slice(7)
    } else if (text.startsWith("https://")) {
      text = text.slice(8)
    }

    if (text.endsWith("/")) {
      text = text.slice(0, -1)
    }

    return text
  }
</script>

<button
  disabled={!action}
  on:click={(event) => {
    if (event.target instanceof HTMLAnchorElement) {
      event.target.focus()
      return
    }

    action?.()
  }}
  class="ring-color flex h-[10.5rem] w-[12rem] min-w-[12rem] cursor-zoom-in flex-col rounded-lg border border-transparent px-3 py-2 text-left shadow-md transition bg-field hyphens focus-visible:outline-none focus-visible:ring"
>
  <p class="mb-1 line-clamp-1">{title}</p>

  <p class="text-sm line-clamp-6">
    {#each modded.split("||") as item, index}
      {@const isLink = !!(index % 2)}

      {#if isLink}
        <a
          class="link"
          href={item}
          data-sveltekit-preload-code="off"
          data-sveltekit-preload-data="off">{trimURL(item)}</a
        >
      {:else}
        {item}
      {/if}
    {/each}
  </p>
</button>
