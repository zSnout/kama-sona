<script lang="ts">
  let className = ""
  export { className as class }
</script>

<h2
  class="{className} border-0 pb-0 font-semibold text-heading"
  class:mt-8={!className.includes("mt-")}
  class:mb-4={!className.includes("mb-")}
>
  <slot />
</h2>
