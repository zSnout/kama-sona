<script lang="ts">
  import type { ClassNameWith } from "./types"

  let className:
    | ClassNameWith<`grid-cols-[repeat(auto-fill,minmax(min(${number}rem,100%),1fr))]`>
    | ClassNameWith<`flex flex-col`>
  export { className as class }

  export let clip = false
</script>

<div
  class="{className} grid"
  class:grid={!className.split(" ").includes("flex")}
  class:gap-[1px]={!(
    className.startsWith("gap-") || className.includes(" gap-")
  )}
  class:overflow-clip={clip}
>
  <slot />
</div>
