<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let color: "red" | "orange" | "yellow" | "green" | "blue" | "purple"
  export let href: string
  export let icon: IconDefinition
  export let label: string

  let className = ""
  export { className as class }
</script>

<a
  class="{className} {className.includes('w-')
    ? ''
    : 'prefer-w-36'} {className.includes('h-')
    ? ''
    : 'h-36'} group flex flex-col items-center justify-center gap-4 rounded-lg border outline-none transition-all focus:ring bg-{color}-200 dark:bg-{color}-900 shadow-{color}-100 ring-{color}-500 hover:border-{color}-500"
  {href}
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
</a>
