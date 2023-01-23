<script lang="ts">
  import BigButton from "$lib/BigButton.svelte"
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import { faBarsProgress } from "@fortawesome/free-solid-svg-icons"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  <BigButtonColored
    color="yellow"
    href="/progress"
    icon={faBarsProgress}
    label="Progress"
  />
</div>
