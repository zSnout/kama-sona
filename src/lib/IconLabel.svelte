<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-brands-svg-icons"
  import Icon from "./Icon.svelte"

  export let href: string | undefined = undefined
  export let icon: IconDefinition
  export let title = ""
  export let content: string | number | boolean = ""

  let className = ""
  export { className as class }
</script>

<p class="{className} mb-0 whitespace-nowrap">
  <Icon isLabel {icon} {title} />

  {#if href}
    <a class="link-colorless" {href}>{content}</a>
  {:else}
    {content}
  {/if}
</p>
