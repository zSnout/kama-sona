<script lang="ts">
  let className = ""
  export { className as class }

  export let href: string | undefined = undefined
</script>

<svelte:element
  this={href ? "a" : "div"}
  class="flex flex-col bg-slate-200 dark:bg-slate-850 {className} p-3"
  {href}
>
  <slot />
</svelte:element>
