<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import type { Feature } from "../layout"

  export let feature: Feature

  let destroyed = false
  let date = new Date()

  onMount(() => {
    destroyed = false

    requestAnimationFrame(function timeout() {
      date = new Date()

      if (!destroyed) {
        requestAnimationFrame(timeout)
      }
    })
  })

  onDestroy(() => (destroyed = true))
</script>

<div
  class="m-auto flex flex-col"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  <p class="m-auto whitespace-nowrap text-[3rem] font-extralight">
    {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
  </p>

  <p class="m-auto whitespace-nowrap">
    {date.toLocaleDateString(undefined, { day: "numeric", month: "long" })}
  </p>
</div>
