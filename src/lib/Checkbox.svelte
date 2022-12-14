<script lang="ts">
  import { faCheck } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let action = () => {
    checked = !checked
  }

  export let checked = false

  let className = ""
  export { className as class }
</script>

<button
  class="flex w-full items-center gap-2 text-left"
  type="button"
  on:click={action}
>
  {#if checked}
    <Icon icon={faCheck} class="h-4 w-4" />
  {:else}
    <span class="h-4 w-4" />
  {/if}

  <span><slot /></span>
</button>
