<script lang="ts">
  import type { ClassNameWith } from "./types"

  let className: ClassNameWith<`grid-cols-[repeat(auto-fill,minmax(min(${number}em,100%),1fr))]`>
  export { className as class }

  export let clip = false
</script>

<div
  class="{className} grid"
  class:overflow-clip={clip}
  class:gap-[1px]={!/\bgap-/.test(className)}
>
  <slot />
</div>
