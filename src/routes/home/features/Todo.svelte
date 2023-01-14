<script lang="ts">
  import Todo from "$lib/Todo.svelte"
  import type { Feature } from "../layout"

  export let feature: Feature
</script>

<Todo
  class="rounded-lg border border-gray-300 dark:border-slate-600"
  style="grid-area: {feature.startY} / {feature.startX} / {feature.endY +
    1} / {feature.endX + 1}"
/>
