<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

  export let isLabel = false
  export let title = ""
  export let icon: IconDefinition
  $: definition = icon?.icon

  let className = ""
  export { className as class }

  export let style = ""
</script>

{#if definition && typeof definition[4] == "string"}
  <svg
    class="overflow-visible {className}"
    class:icon-label={isLabel}
    {style}
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
