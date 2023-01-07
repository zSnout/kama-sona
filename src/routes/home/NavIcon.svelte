<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Icon from "$lib/Icon.svelte"

  export let icon: IconDefinition

  let className = ""
  export { className as class }
</script>

<Icon {icon} class="{className} h-8 w-8 stroke-[16]" />
