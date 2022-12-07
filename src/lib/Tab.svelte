<script lang="ts">
  export let active = false
  export let href: string | undefined = undefined
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={href == null ? "button" : "a"}
  {href}
  class="relative -ml-[1px] -mb-[1px] cursor-pointer rounded-t-lg border bg-gray-100 py-2 px-4 outline-none dark:bg-slate-800 {active
    ? 'z-10 border-gray-300 border-b-gray-100 dark:border-slate-600 dark:border-b-slate-800'
    : 'border-x-0 border-transparent border-b-gray-300 px-[calc(1rem+1px)] dark:border-b-slate-600'}
  before:-left-2 before:rounded-br-lg before:border-r before:shadow-[3px_3px_0_2px_#f3f4f6] after:-right-2 after:rounded-bl-lg after:border-l after:shadow-[-3px_3px_0_2px_#f3f4f6] bafter:absolute bafter:-bottom-[1px] bafter:block bafter:h-1/2 bafter:w-2 bafter:border-b bafter:border-gray-300 bafter:bg-gray-100 bafter:content-['_'] dark:before:shadow-[3px_3px_0_2px_#1e293b] dark:after:shadow-[-3px_3px_0_2px_#1e293b] dark:bafter:border-slate-600 dark:bafter:bg-slate-800"
  class:bafter:hidden={!active}
  on:click
>
  <slot />
</svelte:element>
