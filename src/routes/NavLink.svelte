<script lang="ts">
  import { page } from "$app/stores"

  let className = ""
  export { className as class }

  export let href: string
  export let isHomeIcon = false
  export let title: string
</script>

<a
  on:contextmenu|preventDefault
  class="{className} button-icon tooltip {isHomeIcon ? '' : 'hidden sm:block'}"
  class:active={href == "/"
    ? $page.url.pathname == "/"
    : $page.url.pathname.startsWith(href)}
  {href}
  {title}
>
  <slot />
</a>
