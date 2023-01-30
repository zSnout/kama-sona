<script lang="ts">
  import Todo from "$lib/Todo.svelte"
  import { makeGridArea, type Feature } from "../layout"

  export let feature: Feature
</script>

<Todo
  class="rounded-lg border shadow-sm border-standard"
  style="grid-area:{makeGridArea(feature)}"
/>
