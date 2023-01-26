<script lang="ts">
  import { browser } from "$app/environment"

  export let active: boolean
  export let tooltip: string | undefined = undefined
</script>

<button
  class="relative border-y-2 py-1 px-3 outline-none transition border-bg-field before:whitespace-nowrap last:rounded-r-lg last:border-r-2 focus:z-10 focus:ring focus:ring-focus"
  class:bg-body={active}
  data-tooltip={tooltip}
  disabled={!browser}
  role="checkbox"
  aria-checked={active}
  on:click
>
  <slot />
</button>
