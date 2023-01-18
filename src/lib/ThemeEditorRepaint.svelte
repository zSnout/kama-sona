<script lang="ts">
  import ColorGroupPalette from "./ColorGroupPalette.svelte"
  import {
    closestToInBrightness,
    findColorGroupOf,
    type Colors,
  } from "./colors"
  import { isDark } from "./theme"
  import { customTheme, themeable, type ThemeableType } from "./themeable"

  let y = 0
  let exterior: HTMLElement | undefined
  let type: ThemeableType | undefined
  let colors: Colors | undefined

  function setY() {
    y = exterior?.getBoundingClientRect().bottom || 0
  }

  function getColor(css: string) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(css)
      .trim()

    if (color === "#fff" || color === "white") {
      return "#ffffff"
    }

    return color
  }

  function getCssName(css: `--${string}`) {
    return $isDark ? "--dark-" + css.slice(2) : "--light-" + css.slice(2)
  }

  function repaint() {
    const _type = type
    const _colors = colors

    {
      const type = _type
      const colors = _colors

      if (type && colors) {
        for (const item of themeable) {
          if (item.type == type) {
            delete $customTheme[getCssName(item.css)]
          }
        }

        customTheme.update((x) => x)

        requestAnimationFrame(() => {
          for (const item of themeable) {
            if (item.type != type) {
              continue
            }

            const color = getColor(getCssName(item.css))
            const [, originalPalette] = findColorGroupOf(color) || []

            const newColorFromPalette = originalPalette
              ? colors[originalPalette.indexOf(color as `#${string}`)]
              : undefined

            console.log({ newColorFromPalette, css: item.css })

            if (newColorFromPalette) {
              $customTheme[getCssName(item.css)] = newColorFromPalette
            } else {
              $customTheme[getCssName(item.css)] = closestToInBrightness(
                color,
                colors
              )
            }
          }
        })
      }
    }
  }
</script>

<div
  class="mb-4 flex w-full items-center justify-center gap-3"
  bind:this={exterior}
>
  <p class="mr-4" class:opacity-30={type}>Repaint...</p>

  <button
    class="field flex w-32 items-center justify-center underline underline-offset-2 transition bg-body text-link"
    class:opacity-30={type && type != "text"}
    on:click={() => {
      if (type == "text") {
        type = undefined
        return
      }

      setY()
      type = "text"
    }}
  >
    Text
  </button>

  <button
    class="field flex w-32 items-center justify-center transition bg-active"
    class:opacity-30={type && type != "bg"}
    on:click={() => {
      if (type == "bg") {
        type = undefined
        return
      }

      setY()
      type = "bg"
    }}
  >
    Background
  </button>

  <button
    class="field ring-color-initial flex w-32 items-center justify-center border ring bg-body"
    class:opacity-30={type && type != "active"}
    on:click={() => {
      if (type == "active") {
        type = undefined
        return
      }

      setY()
      type = "active"
    }}
  >
    Active
  </button>
</div>

{#if type}
  <ColorGroupPalette
    allowCustomColor={false}
    class="fixed left-[calc(100%_-_18.25rem)] z-10 -translate-x-1/2 overflow-hidden rounded-md shadow-md transition-all"
    selected={type == "active"
      ? $customTheme[getCssName("--border-focus")] || getColor("--border-focus")
      : type == "bg"
      ? $customTheme[getCssName("--bg-body")] || getColor("--bg-body")
      : type == "text"
      ? $customTheme[getCssName("--text-body")] || getColor("--text-body")
      : "#ffffff"}
    style="top:{y + 16}px"
    on:inputGroup={(event) => {
      colors = event.detail
      repaint()
    }}
    on:click={() => (type = undefined)}
  />
{/if}
