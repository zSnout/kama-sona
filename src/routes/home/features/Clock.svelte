<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { makeGridArea, type Feature } from "../layout"

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

<div class="m-auto flex flex-col" style:grid-area={makeGridArea(feature)}>
  <p class="m-auto whitespace-nowrap text-[3rem] font-extralight">
    {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
  </p>

  <p class="m-auto whitespace-nowrap">
    {date.toLocaleDateString(undefined, { day: "numeric", month: "long" })}
  </p>
</div>
