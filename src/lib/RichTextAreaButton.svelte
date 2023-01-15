<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let action: (event: MouseEvent) => void
  export let active = false
  export let icon: IconDefinition
  export let title: string
  export let tooltip: string

  tooltip
</script>

<button
  on:click={action}
  class="h-8 w-8 rounded-md p-2 {active ? 'rta-button bg-filter-active' : ''}"
  type="button"
>
  <Icon {icon} class="h-4 w-4" />

  <span class="sr-only">{title}</span>
</button>
