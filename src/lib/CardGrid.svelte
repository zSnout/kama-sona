<script lang="ts">
  import type { ClassNameWith } from "./types"

  let className: ClassNameWith<`grid-cols-[repeat(auto-fill,minmax(min(${number}em,100%),1fr))]`>
  export { className as class }
</script>

<div class="{className} grid gap-[1px] bg-gray-300 dark:bg-slate-600">
  <slot />
</div>
