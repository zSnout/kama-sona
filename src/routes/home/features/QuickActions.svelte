<script lang="ts">
  import IconColorAndText from "$lib/IconColorAndText.svelte"
  import { isDark } from "$lib/theme"
  import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  <IconColorAndText
    class="prefer-w-32 h-32 max-w-[8rem] flex-1"
    color={$isDark ? "slate" : "gray"}
    href="/create"
    icon={faPlus}
    label="Create"
  />

  <IconColorAndText
    class="prefer-w-32 h-32 max-w-[8rem] flex-1"
    color={$isDark ? "slate" : "gray"}
    href="/search?range=week"
    icon={faSearch}
    label="Search"
  />
</div>
