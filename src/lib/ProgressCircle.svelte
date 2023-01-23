<script lang="ts">
  let className = ""
  export { className as class }

  /** Ranges from 0 to 1. */
  export let value: -1 | (number & {})

  export let href: string | undefined = undefined
  export let type: "div" | "button" | "a" = "div"
  export let hoverable = type == "button" || (type == "a" && href)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={type}
  class="{className} group relative flex rounded-full p-4 transition bg-chart hover:bg-field"
  {href}
  on:click
>
  <!-- https://daisyui.com/components/radial-progress/ -->

  {#if value != -1}
    <div
      class="absolute top-0 left-0 h-full w-full rounded-full transition bg-chart"
      class:group-hover:opacity-30={hoverable}
      style="background: radial-gradient(farthest-side,var(--bg-chart-active) 98%,#0000) top/1rem 1rem no-repeat,conic-gradient(var(--bg-chart-active) var(--value),#0000 0)"
      style:--value="{100 * value}%"
    >
      <div
        class="absolute left-[var(--left)] top-[var(--top)] block h-4 w-4 rounded-full bg-chart-active"
        style="transform: translate(-0.5rem, -0.5rem) rotate(var(--rotate)) translateY(0.5rem)"
        style:--left="{Math.cos(value * 2 * Math.PI - Math.PI / 2) * 50 + 50}%"
        style:--top="{Math.sin(value * 2 * Math.PI - Math.PI / 2) * 50 + 50}%"
        style:--rotate="{value * 360}deg"
      />
    </div>
  {/if}

  <div
    class="relative flex h-full w-full flex-1 flex-col justify-center rounded-full p-4 transition bg-body"
    class:group-hover:bg-field={hoverable}
  >
    <slot />
  </div>
</svelte:element>
