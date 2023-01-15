<script lang="ts">
  let className = ""
  export { className as class }

  export let highlightFirst = false
</script>

<div
  class="{className} {highlightFirst
    ? 'odd:child:bg-table-row'
    : 'even:child:bg-table-row'}"
>
  <slot />
</div>
