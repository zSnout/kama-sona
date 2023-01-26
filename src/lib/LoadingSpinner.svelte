<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons"
  import { onDestroy } from "svelte"
  import Icon from "./Icon.svelte"

  let className = ""
  export { className as class }

  let rotation = 0

  let timeoutId = setTimeout(function tick() {
    rotation += 45
    setTimeout(tick, 100)
  }, 100)

  onDestroy(() => clearTimeout(timeoutId))
</script>

<Icon
  class="{className} h-8 w-8"
  style="transform:rotate({rotation}deg)"
  icon={faSpinner}
/>
