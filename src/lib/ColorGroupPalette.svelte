<script lang="ts">
  import { faCheck } from "@fortawesome/free-solid-svg-icons"
  import { createEventDispatcher } from "svelte"
  import {
    brightness,
    closestToInBrightness,
    tailwindColors,
    type Colors,
  } from "./colors"
  import Icon from "./Icon.svelte"

  let className = ""
  export { className as class }

  export let selected: string
  export let allowCustomColor = true

  $: indexOfSelected = tailwindColors
    .map(([, colors]) =>
      colors.indexOf(
        // @ts-ignore
        selected
      )
    )
    .filter((e) => e != -1)[0] as
    | undefined
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9

  const dispatcher = createEventDispatcher<{
    click: undefined
    input: `#${string}`
    inputGroup: Colors
  }>()

  let hoveredName = ""
  let lastHoveredName = ""
  let hoveredColor = ""
  let realHoveredColor = ""
  let realHoveredGroup: Colors | undefined
  let tooltipX = 0
  let tooltipY = 0
  let isPressingP = false

  export let style: string | undefined = undefined
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key == "Escape") {
      dispatcher("click")
      event.stopImmediatePropagation()
    }

    if (
      (event.key == "p" || event.key == "P") &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      isPressingP = true

      if (realHoveredColor.startsWith("#")) {
        dispatcher("input", realHoveredColor)
      }

      if (realHoveredGroup) {
        dispatcher("inputGroup", realHoveredGroup)
      }
    }
  }}
  on:keyup={(event) => {
    if (event.key == "p" || event.key == "P") {
      isPressingP = false
    }
  }}
/>

<div class="{className} cursor-pointer bg-field text-field" {style}>
  <div
    class="grid w-72 grid-cols-5 gap-2 p-2"
    on:mousemove={(event) => {
      tooltipX = event.clientX
      tooltipY = event.clientY
    }}
    on:mouseleave={() => {
      hoveredName = ""
      hoveredColor = ""
      realHoveredColor = ""
    }}
  >
    {#each tailwindColors as [name, colors]}
      {@const color = indexOfSelected
        ? colors[indexOfSelected]
        : closestToInBrightness(selected, colors)}

      <button
        class="relative grid h-12 w-12 grid-cols-3 grid-rows-3 overflow-hidden rounded-sm outline-none"
        on:mouseenter={() => {
          lastHoveredName = hoveredName = name
          hoveredColor = colors[5]
          realHoveredColor = color
          realHoveredGroup = colors

          if (isPressingP) {
            dispatcher("input", color)
            dispatcher("inputGroup", colors)
          }
        }}
        on:click={() => {
          dispatcher("input", color)
          dispatcher("inputGroup", colors)
        }}
        on:dblclick={() => dispatcher("click")}
      >
        {#each colors.slice(1) as color}
          <div
            class="flex h-4 w-4 items-center justify-center"
            style:background-color={color}
          />
        {/each}

        {#if colors.includes(// @ts-ignore
          selected)}
          <Icon
            icon={faCheck}
            class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 {brightness(
              colors[5]
            ) > 128
              ? 'text-black'
              : 'text-white'}"
          />
        {/if}
      </button>
    {/each}

    {#if allowCustomColor}
      <input
        class="col-span-2 h-full w-full overflow-hidden rounded-sm color-swatch-wrapper:p-0 color-swatch:border-0"
        type="color"
        bind:value={selected}
        on:input={() => {
          if (selected?.startsWith("#")) {
            dispatcher("input", selected)
          }
        }}
        on:mousemove={() => {
          hoveredName = ""
          hoveredColor = ""
        }}
      />
    {/if}

    <button
      class="flex items-center justify-center rounded-sm"
      class:col-span-3={!allowCustomColor}
      on:click
      on:mousemove={() => {
        hoveredName = ""
        hoveredColor = ""
      }}
    >
      <Icon class="h-4 w-4" icon={faCheck} />
    </button>
  </div>
</div>

<div
  class="tooltip fixed w-28 border-0 px-0 text-center opacity-100 backdrop-blur-lg transition"
  class:opacity-0={hoveredName == ""}
  style:top="{tooltipY}px"
  style:left="{tooltipX}px"
  style:background-color={(hoveredColor || selected || "#ffffff") + "80"}
  style:color={brightness(hoveredColor || selected || "#ffffff") > 128
    ? "black"
    : "white"}
>
  {lastHoveredName}
</div>
