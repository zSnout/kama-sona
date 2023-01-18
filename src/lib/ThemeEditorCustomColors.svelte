<script lang="ts">
  import { faDropletSlash } from "@fortawesome/free-solid-svg-icons"
  import ColorGroupPalette from "./ColorGroupPalette.svelte"
  import ColorPalette from "./ColorPalette.svelte"
  import Icon from "./Icon.svelte"
  import { isDark } from "./theme"
  import { customTheme, themeable1, themeable2 } from "./themeable"

  function getColor(css: string) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(css)
      .trim()

    if (color === "#fff" || color === "white") {
      return "#ffffff"
    }

    return color
  }

  $: {
    $isDark
    customTheme.update((x) => x)

    setTimeout(() => {
      customTheme.update((x) => x)
    }, 10)

    setTimeout(() => {
      customTheme.update((x) => x)
    }, 100)
  }

  let colorTop = 0
  let colorBottom = 0
  let selectedButton = ""
  let useGroupPalette = false

  $: selectedButtonCSS = selectedButton
    ? ($isDark ? "--dark-" : "--light-") + selectedButton.slice(2)
    : ""
</script>

<div class="grid grid-cols-2">
  {#each [themeable1, themeable2] as themeable, columnIndex}
    <div class="flex flex-col gap-1">
      {#each themeable as { css: cssOg, name }, index}
        {#if cssOg.startsWith("#")}
          <h2 class="mt-4 pl-6 font-semibold" class:opacity-30={selectedButton}>
            {name}
          </h2>
        {:else}
          {@const css = ($isDark ? "--dark-" : "--light-") + cssOg.slice(2)}
          {@const id = "theme-editor-" + index + "-" + columnIndex}

          <div
            class="group flex gap-2 transition"
            class:opacity-30={selectedButton && selectedButton != cssOg}
          >
            <button
              class="h-full transition-all duration-500"
              class:scale-100={$customTheme[css] != null}
              class:scale-75={$customTheme[css] == null}
              class:opacity-100={$customTheme[css] != null}
              class:opacity-0={$customTheme[css] == null}
              class:pointer-events-none={$customTheme[css] == null}
              aria-hidden={$customTheme[css] == null}
              type="button"
              on:click={() => {
                delete $customTheme[css]
                $customTheme = $customTheme
              }}
            >
              <Icon class="h-4 w-4" icon={faDropletSlash} />
            </button>

            <input
              class="ring-colors relative h-6 w-6 overflow-hidden rounded-sm outline-none transition-all color-swatch-wrapper:p-0 color-swatch:border-0"
              type="color"
              class:scale-150={selectedButton == cssOg}
              class:shadow-sm={selectedButton == cssOg}
              class:z-10={selectedButton == cssOg}
              {id}
              value={$customTheme[css] || getColor(css)}
              on:click={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                colorBottom = rect.bottom
                colorTop = rect.top
                event.preventDefault()

                if (selectedButton == cssOg && !useGroupPalette) {
                  selectedButton = ""
                  return
                }

                selectedButton = cssOg
                useGroupPalette = false
              }}
              on:contextmenu={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                colorBottom = rect.bottom
                colorTop = rect.top
                event.preventDefault()

                if (selectedButton == cssOg && useGroupPalette) {
                  selectedButton = ""
                  return
                }

                selectedButton = cssOg
                useGroupPalette = true
              }}
              on:input={(event) => {
                const color = event.currentTarget.value

                if (color) {
                  $customTheme[css] = color
                } else {
                  delete $customTheme[css]
                  $customTheme = $customTheme
                }
              }}
            />

            <label
              class="ml-2 flex-1"
              for={id}
              on:contextmenu={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                colorBottom = rect.bottom
                colorTop = rect.top
                event.preventDefault()

                if (selectedButton == cssOg && useGroupPalette) {
                  selectedButton = ""
                  return
                }

                selectedButton = cssOg
                useGroupPalette = true
              }}>{name}</label
            >
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>

{#if selectedButton}
  <svelte:component
    this={useGroupPalette ? ColorGroupPalette : ColorPalette}
    class="fixed left-[calc(100%_-_18.25rem)] z-10 -translate-x-1/2 overflow-hidden rounded-md shadow-md transition-all {colorBottom >=
    innerHeight / 2
      ? '-translate-y-full'
      : ''}"
    selected={$customTheme[selectedButtonCSS] || getColor(selectedButtonCSS)}
    style="top:{colorBottom < innerHeight / 2
      ? colorBottom + 16
      : colorTop - 16}px"
    on:click={() => (selectedButton = "")}
    on:input={(event) => ($customTheme[selectedButtonCSS] = event.detail)}
  />
{/if}
