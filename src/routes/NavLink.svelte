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
  class="{className} button-icon {isHomeIcon
    ? ''
    : 'hidden sm:block'} outline-none ring-current active:ring-0 focus:ring-2"
  class:active={href == "/"
    ? $page.url.pathname == "/"
    : $page.url.pathname.startsWith(
        href.match(/^[^?]+/)?.[0] || "$NEVER_MATCH"
      )}
  draggable="false"
  {href}
  {title}
  data-tooltip={tooltip}
>
  <slot />
</a>
