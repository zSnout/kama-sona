<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

  export let icon: IconDefinition
  $: definition = icon?.icon

  let className = ""
  export { className as class }
</script>

{#if definition && typeof definition[4] == "string"}
  <svg
    class="overflow-visible {className}"
    viewBox="0 0 {definition[0]} {definition[1]}"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={"" + definition[4]} />
  </svg>
{/if}
