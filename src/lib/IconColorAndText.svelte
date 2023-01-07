<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"
  import type { ClassNameWith } from "./types"

  export let color:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "gray"
    | "slate"

  export let href: string
  export let icon: IconDefinition
  export let label: string

  let className: ClassNameWith<
    | `h-${number} flex-${number}`
    | `h-${number} max-w-[${number}rem]`
    | `h-${number} w-${number}`
    | `prefer-w-${number} h-${number}`
  > = "prefer-w-48 h-48"
  export { className as class }
</script>

<a
  class="bg-{color}-200 dark:bg-{color}-900 shadow-{color}-100 ring-{color}-500 hover:border-{color}-500 flex {className} flex-col items-center justify-center gap-4 rounded-lg border border-transparent shadow-lg outline-none transition-all focus:ring dark:shadow-none"
  {href}
>
  <Icon class="icon-{color} h-8 w-8" {icon} />

  <p class="text-{color}-700 dark:text-{color}-300 font-semibold">
    {label}
  </p>
</a>
