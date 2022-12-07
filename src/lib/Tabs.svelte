<script lang="ts">
  let className: string
  export { className as class }
</script>

<div class="{className} overflow-x-auto overflow-y-visible">
  <div class="flex border-b border-gray-300 px-4 dark:border-slate-600">
    <slot />
  </div>
</div>
