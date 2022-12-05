<script lang="ts">
  let className: string
  export { className as class }
</script>

<div class="flex flex-col {className} bg-white p-3 dark:bg-slate-800">
  <slot />
</div>
