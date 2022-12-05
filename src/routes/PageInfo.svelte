<script lang="ts">
  import Card from "$lib/Card.svelte"

  export let href: string
  export let title: string

  let className: string
  export { className as class }
</script>

<Card class={className}>
  <a class="mb-4 flex" {href}>
    <slot name="icon" />

    <p class="ml-auto pb-2 font-semibold underline underline-offset-2">
      {title}
    </p>
  </a>

  <div class="stats text-slate-500 dark:text-slate-400">
    <slot name="stats">
      <p><strong>23</strong> to do</p>
      <p><strong>5</strong> in progress</p>
      <p><strong>3</strong> completed</p>
      <p><strong>4</strong> missing</p>
    </slot>
  </div>
</Card>

<style global lang="postcss">
  .stats :global(strong) {
    @apply text-slate-900 dark:text-slate-300;
  }
</style>
