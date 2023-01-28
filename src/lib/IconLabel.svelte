<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-brands-svg-icons"
  import Icon from "./Icon.svelte"

  export let href: string | undefined = undefined
  export let icon: IconDefinition
  export let title = ""
  export let content: string | number | boolean = ""

  let htmlFor: string | undefined = undefined
  export { htmlFor as for }

  let className = ""
  export { className as class }
</script>

<svelte:element
  this={htmlFor ? "label" : "p"}
  for={htmlFor}
  class="{className} mb-0 whitespace-nowrap"
  data-no-rta-focus={htmlFor ? "" : undefined}
>
  <Icon isLabel {icon} {title} />

  {#if href}
    <a class="link-colorless" {href}>{content}</a>
  {:else}
    {content}
  {/if}
</svelte:element>
