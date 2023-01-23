<script lang="ts">
  import HeaderItemLike from "./HeaderItemLike.svelte"

  export let count: number
  export let filter: "exempt" | "graded" | "late" | "missing" | undefined
  export let type: "exempt" | "graded" | "late" | "missing"
</script>

<HeaderItemLike
  active={filter == type}
  on:click={() => (filter = filter == type ? undefined : type)}
>
  {count}

  <span class="text-sm font-medium text-label">{type}</span>
</HeaderItemLike>
