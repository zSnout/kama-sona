<script lang="ts">
  export let title: string
  export let mode: "head-only" | "body-only" | "both" = "both"
</script>

<svelte:head>
  {#if mode != "body-only"}
    <title>{title}</title>
  {/if}
</svelte:head>

{#if mode != "head-only"}
  <h1
    class="title mb-4 select-none text-lg font-semibold text-slate-800 dark:text-slate-100"
  >
    <slot>
      {title}
    </slot>
  </h1>
{/if}
