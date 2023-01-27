<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let href: string | undefined = undefined
  export let icon: IconDefinition
  export let label: string

  let className = ""
  export { className as class }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={href ? "a" : "button"}
  class="{className} group prefer-w-32 flex h-32 flex-col items-center justify-center gap-4 rounded-lg border outline-none transition-all big-button-bg big-button-border hover:big-button-hover-bg hover:big-button-hover-border focus:ring"
  {href}
  on:click
>
  <Icon
    class="h-8 w-8 transition big-button-icon group-hover:big-button-hover-icon"
    {icon}
  />

  <p
    class="font-semibold transition big-button-text group-hover:big-button-hover-text"
  >
    {label}
  </p>
</svelte:element>
