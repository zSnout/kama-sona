<script lang="ts">
  let className = ""
  export { className as class }

  export let highlightFirst = false
</script>

<div
  class="{className} {highlightFirst
    ? 'odd:child:bg-hover even:child:bg-body'
    : 'odd:child:bg-body even:child:bg-hover'}"
>
  <slot />
</div>
