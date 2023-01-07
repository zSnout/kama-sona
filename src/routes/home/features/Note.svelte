<script lang="ts">
  import RichTextArea from "$lib/RichTextArea.svelte"
  import { writable } from "svelte-local-storage-store"
  import type { Feature } from "../layout"

  export let feature: Feature
  const note = writable("note", "")
</script>

<div
  class="flex"
  style:grid-row="{feature.startY} / {feature.endY + 1}"
  style:grid-column="{feature.startX} / {feature.endX + 1}"
>
  <RichTextArea
    class="resize-none"
    placeholder="Type a note to yourself..."
    bind:value={$note}
  />
</div>
