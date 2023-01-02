<script lang="ts">
  import { page } from "$app/stores"

  let className = ""
  export { className as class }

  export let href: string
  export let title: string
</script>

<a
  on:contextmenu|preventDefault
  class="{className} button-icon-wide flex items-center rounded-lg p-2 font-semibold transition before:hidden hover:fill-current active:scale-90"
  class:active={href == "/"
    ? $page.url.pathname == "/"
    : $page.url.pathname.startsWith(href)}
  draggable="false"
  {href}
  {title}
  on:click
>
  <div class="mx-auto flex w-48 max-w-full items-center">
    <slot />

    <p class="ml-auto">{title}</p>
  </div>
</a>
