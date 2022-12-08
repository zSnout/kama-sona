<script lang="ts">
  let className: string
  export { className as class }
</script>

<div class="{className} tabs overflow-x-auto overflow-y-visible">
  <div class="flex border-b border-gray-350 px-4 dark:border-slate-600">
    <slot />
  </div>
</div>

<style lang="postcss">
  .tabs::-webkit-scrollbar {
    display: none;
  }
</style>
