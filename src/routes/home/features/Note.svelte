<script lang="ts">
  import { note, notifyOtherSetters, setters } from "$lib/noteStore"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="flex"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  <RichTextArea
    class="resize-none"
    fieldClass="flex-1"
    placeholder="Type a note to yourself..."
    bind:value={$note}
    on:input={(event) => notifyOtherSetters(event.detail[0])}
    on:value-setter={(event) => setters.add(event.detail)}
    on:remove-value-setter={(event) => setters.delete(event.detail)}
  />
</div>
