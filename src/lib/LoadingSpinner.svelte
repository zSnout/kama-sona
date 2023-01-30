<script lang="ts">
  import { browser } from "$app/environment"
  import { faSpinner } from "@fortawesome/free-solid-svg-icons"
  import { onDestroy } from "svelte"
  import Icon from "./Icon.svelte"

  let className = ""
  export { className as class }

  let rotation = 45 * Math.floor(performance.now() / 100)

  let frameId = browser
    ? requestAnimationFrame(function tick() {
        rotation = 45 * Math.floor(performance.now() / 100)
        requestAnimationFrame(tick)
      })
    : 0

  onDestroy(() => globalThis.cancelAnimationFrame?.(frameId))
</script>

<Icon
  class="{className} h-8 w-8"
  style="transform:rotate({rotation}deg)"
  icon={faSpinner}
/>
