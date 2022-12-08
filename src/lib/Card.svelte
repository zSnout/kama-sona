<script lang="ts">
  let className = ""
  export { className as class }

  export let href: string | undefined = undefined
</script>

<svelte:element
  this={href ? "a" : "div"}
  class="flex flex-col {className} p-3 ring-1 ring-gray-350 dark:ring-slate-600"
  {href}
>
  <slot />
</svelte:element>
