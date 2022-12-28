<script lang="ts">
  let className = ""
  export { className as class }

  export let href: string | undefined = undefined
</script>

<svelte:element
  this={href ? "a" : "div"}
  class="flex {className} p-3 ring-1 ring-gray-350 dark:ring-slate-600"
  class:flex-col={!className.includes("flex-row")}
  {href}
>
  <slot />
</svelte:element>
