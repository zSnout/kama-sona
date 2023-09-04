<script lang="ts">
  import { page } from "$app/stores"
  import { mergeQueryParam } from "./mergeQueryParam"

  /** Whether this filter is active. Use `bind:active` with this prop. */
  export let active: boolean | undefined = false

  let className = ""
  export { className as class }

  /** Whether this filter is disabled. */
  export let disabled = false

  /** A query param to set when this filter is clicked. Useful when JS is disabled client-side. */
  export let param: [key: string, value: string] | undefined = undefined

  /** Whether this filter should force all other filters to be disabled. */
  export let forceSingle = !param

  /** A tooltip to display when this filter is hovered. */
  export let tooltip: string | undefined = undefined

  $: if (disabled) {
    active = false
  }

  $: href = param
    ? active
      ? mergeQueryParam($page.url, param[0], "")
      : mergeQueryParam($page.url, param[0], param[1])
    : undefined
</script>

<!--
  svelte-ignore
  a11y-click-events-have-key-events
  a11y-interactive-supports-focus
-->
<svelte:element
  this={param && !disabled ? "a" : "button"}
  class="{className} ring-color relative -ml-px mr-1 flex h-8 items-center border border-transparent px-3 shadow transition first:ml-0 first:rounded-l-full first:pl-4 last:mr-0 last:rounded-r-full last:pr-4 focus:z-10 focus:outline-none focus:ring focus:border-focus"
  role="checkbox"
  aria-checked={active}
  class:flex={param && !disabled}
  class:bg-filter={!active}
  class:bg-filter-active={active}
  class:opacity-30={disabled}
  class:cursor-default={disabled}
  href={disabled ? undefined : href}
  {disabled}
  data-tooltip={disabled ? undefined : tooltip}
  on:click={(
    // @ts-ignore We can't set types in Svelte props yet. Additionally,
    // JSDoc types don't work in a TypeScript environment, which this prop
    // apparently is, even though it doesn't support TS syntax.
    event
  ) => {
    if (disabled) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      event.preventDefault()
    }

    setTimeout(() => (active = !active))

    if (forceSingle || !(event.ctrlKey || event.metaKey)) {
      event.currentTarget.parentElement?.childNodes.forEach(
        (
          // @ts-ignore See the previous comment.
          node
        ) => {
          if (node != event.currentTarget) {
            node.dispatchEvent(new Event("filter-disable"))
          }
        }
      )
    }
  }}
  on:filter-disable={() => (active = false)}
>
  <slot />
</svelte:element>
