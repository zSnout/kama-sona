<script lang="ts">
  import IconColorAndText from "$lib/IconColorAndText.svelte"
  import { isDark } from "$lib/theme"
  import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-row="{feature.startY} / {feature.endY + 1}"
  style:grid-column="{feature.startX} / {feature.startX + 1}"
>
  <IconColorAndText
    class="h-32 max-w-[8rem] flex-1"
    color={$isDark ? "slate" : "gray"}
    href="/create"
    icon={faPlus}
    label="Create"
  />

  <IconColorAndText
    class="h-32 max-w-[8rem] flex-1"
    color={$isDark ? "slate" : "gray"}
    href="/search?range=week"
    icon={faSearch}
    label="Search"
  />
</div>
