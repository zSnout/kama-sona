<script lang="ts">
  let className = ""
  export { className as class }
</script>

<div class="{className} flex flex-wrap gap-x-8 gap-y-1">
  <slot />
</div>
