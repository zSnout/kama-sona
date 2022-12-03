<script lang="ts">
  export let title: string
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1 class="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
  <slot>
    {title}
  </slot>
</h1>
