<script lang="ts">
  import { faCheck } from "@fortawesome/free-solid-svg-icons"
  import { createEventDispatcher } from "svelte"
  import { brightness, indexToThemeValue, tailwindColors } from "./colors"
  import Icon from "./Icon.svelte"

  let className = ""
  export { className as class }

  export let selected: string

  const dispatcher = createEventDispatcher<{
    click: undefined
    input: `#${string}`
  }>()

  let hoveredName = ""
  let lastHoveredName = ""
  let hoveredStrength = ""
  let lastHoveredStrength = ""
  let hoveredColor = ""
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

      if (hoveredColor.startsWith("#")) {
        dispatcher("input", hoveredColor)
      }
    }
  }}
  on:keyup={(event) => {
    if (event.key == "p" || event.key == "P") {
      isPressingP = false
    }
  }}
/>

<div
  class="{className} flex cursor-pointer flex-col bg-field text-field"
  {style}
>
  <div
    class="flex"
    on:mousemove={(event) => {
      tooltipX = event.clientX
      tooltipY = event.clientY
    }}
    on:mouseleave={() => {
      hoveredName = ""
      hoveredStrength = ""
      hoveredColor = ""
    }}
  >
    {#each tailwindColors as [name, colors]}
      <div class="flex flex-col">
        {#each colors as color, index}
          {@const perceived = brightness(color)}

          <button
            class="flex h-6 w-6 items-center justify-center outline-none"
            style:background-color={color}
            on:click={() => dispatcher("input", color)}
            on:dblclick={() => dispatcher("click")}
            on:mouseenter={() => {
              lastHoveredName = hoveredName = name
              lastHoveredStrength = hoveredStrength =
                "" + indexToThemeValue(index)
              hoveredColor = color

              if (isPressingP) {
                dispatcher("input", color)
              }
            }}
          >
            {#if selected == color}
              <Icon
                icon={faCheck}
                class="h-4 w-4 {perceived > 128 ? 'text-black' : 'text-white'}"
              />
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>

  <div class="flex h-8">
    <input
      class="h-full w-full cursor-pointer color-swatch-wrapper:p-0 color-swatch:border-0"
      type="color"
      bind:value={selected}
      on:input={() => {
        if (selected?.startsWith("#")) {
          dispatcher("input", selected)
        }
      }}
    />

    <button
      class="flex h-8 w-8 items-center justify-center"
      on:click
      style:background-color={selected}
      style:color={brightness(selected || "#ffffff") > 128 ? "black" : "white"}
    >
      <Icon class="h-4 w-4" icon={faCheck} />
    </button>
  </div>
</div>

<div
  class="tooltip fixed flex w-28 justify-center border-0 px-0 opacity-100 backdrop-blur-lg transition"
  class:opacity-0={hoveredName == "" || hoveredStrength == ""}
  style:top="{tooltipY}px"
  style:left="{tooltipX}px"
  style:background-color={(hoveredColor || selected || "#ffffff") + "80"}
  style:color={brightness(hoveredColor || selected || "#ffffff") > 128
    ? "black"
    : "white"}
>
  <span class="mr-auto pl-3">{lastHoveredName}</span>
  <span class="px-3">{lastHoveredStrength}</span>
</div>
