<script lang="ts">
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import { pages } from "$lib/pages"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  {#each pages as page}
    <BigButtonColored
      color={page.color}
      href={page.href}
      icon={page.icon}
      label={page.title}
    />
  {/each}
</div>
