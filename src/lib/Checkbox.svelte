<script lang="ts">
  import { faCheck } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let action = () => {
    checked = !checked
  }

  export let checked = false
  export let noWrap = false
  export let tabindex: -1 | 0 | undefined = undefined
</script>

<button
  class="flex w-full items-center gap-2 py-px text-left"
  type="button"
  on:click={action}
  {tabindex}
  role="checkbox"
  aria-checked={checked}
>
  {#if checked}
    <Icon icon={faCheck} class="h-4 w-4" />
  {:else}
    <span class="h-4 w-4" />
  {/if}

  <span
    class:overflow-hidden={noWrap}
    class:text-ellipsis={noWrap}
    class:whitespace-nowrap={noWrap}
  >
    <slot />
  </span>
</button>
