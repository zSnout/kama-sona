<script lang="ts">
  import BigButton from "$lib/BigButton.svelte"
  import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  <BigButton
    class="prefer-w-32 h-32 max-w-[8rem] flex-1"
    href="/create"
    icon={faPlus}
    label="Create"
  />

  <BigButton
    class="prefer-w-32 h-32 max-w-[8rem] flex-1"
    href="/search?range=week"
    icon={faSearch}
    label="Search"
  />
</div>
