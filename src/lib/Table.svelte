<script lang="ts">
  let className = ""
  export { className as class }

  export let highlightFirst = false
</script>

<div
  class="{className} {highlightFirst
    ? 'odd:child:bg-gray-200 even:child:bg-gray-100 dark:odd:child:bg-slate-700 dark:even:child:bg-slate-800'
    : 'odd:child:bg-gray-100 even:child:bg-gray-200 dark:odd:child:bg-slate-800 dark:even:child:bg-slate-700'}"
>
  <slot />
</div>
