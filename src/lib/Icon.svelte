<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

  export let isLabel = false
  export let title = ""
  export let icon: IconDefinition
  $: definition = icon?.icon

  let className = ""
  export { className as class }
</script>

{#if definition && typeof definition[4] == "string"}
  <svg
    class="overflow-visible {className} {isLabel
      ? 'relative -top-[0.125rem] mr-1 inline h-4 w-4 text-gray-350 dark:text-slate-500'
      : ''}"
    viewBox="0 0 {definition[0]} {definition[1]}"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d={"" + definition[4]} />
  </svg>

  <span class="sr-only">{title}</span>
{/if}
