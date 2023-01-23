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
  class="{className} prefer-w-32 flex h-32 flex-col items-center justify-center gap-4 rounded-lg border border-transparent outline-none transition-all focus:ring bg-{color}-200 dark:bg-{color}-900 shadow-{color}-100 shadow-lg dark:shadow-black/10 ring-{color}-500 hover:border-{color}-500"
  {href}
>
  <Icon
    class="h-8 w-8 transition text-{color}-500 dark:text-{color}-400"
    {icon}
  />

  <p class="font-semibold transition text-{color}-700 dark:text-{color}-200">
    {label}
  </p>
</a>
