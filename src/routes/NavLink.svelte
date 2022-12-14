<script lang="ts">
  import { page } from "$app/stores"

  let className = ""
  export { className as class }

  export let href: string
  export let isHomeIcon = false
  export let title: string
  export let tooltip: string
</script>

<a
  on:contextmenu|preventDefault
  class="{className} button-icon select-none {isHomeIcon
    ? ''
    : 'hidden sm:block'}"
  class:active={href == "/"
    ? $page.url.pathname == "/"
    : $page.url.pathname.startsWith(href)}
  draggable="false"
  {href}
  {title}
  data-tooltip={tooltip}
>
  <slot />
</a>
