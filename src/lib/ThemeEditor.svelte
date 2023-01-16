<script lang="ts">
  import {
    faClock,
    faDownload,
    faDropletSlash,
    faFillDrip,
    faMoon,
    faSquareFull,
    faSun,
    faTrash,
    faUpload,
  } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"
  import { isDark, toggle } from "./theme"
  import { customTheme, themeable1, themeable2 } from "./themeable"

  let className = ""
  export { className as class }

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

  let uploadEl: HTMLInputElement | undefined
</script>

<div class="{className} flex flex-col gap-2 overflow-auto px-3 py-6">
  <div class="-mb-1 flex w-full justify-center gap-3">
    <button
      class="field flex items-center justify-center bg-body"
      on:click={() => {
        if (confirm("Are you sure you want to reset your theme?")) {
          customTheme.set({})
        }
      }}
      aria-label="Reset Theme"
      data-tooltip="Reset"
    >
      <Icon class="h-4 w-4" icon={faTrash} />
    </button>

    <button
      class="field flex items-center justify-center bg-body"
      on:click={() => {
        const stringified = JSON.stringify($customTheme, undefined, 2)
        const blob = new Blob([stringified], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "theme.json"
        link.click()
      }}
      aria-label="Download Theme"
      data-tooltip="Download"
    >
      <Icon class="h-4 w-4" icon={faDownload} />
    </button>

    <button
      class="field flex items-center justify-center bg-body"
      on:click={() => uploadEl?.click()}
      aria-label="Upload Theme"
      data-tooltip="Upload"
    >
      <Icon class="h-4 w-4" icon={faUpload} />
    </button>

    <input
      class="hidden"
      type="file"
      bind:this={uploadEl}
      on:change={(event) => {
        const file = event.currentTarget.files?.[0]

        if (!file) {
          return
        }

        event.currentTarget.value = ""

        file.text().then((text) => {
          try {
            const theme = JSON.parse(text)
            customTheme.set(theme)
          } catch {
            alert("Your theme file is invalid.")
          }
        })
      }}
    />

    <button
      class="field flex items-center justify-center"
      class:active={$customTheme.flat == "true"}
      class:bg-body={$customTheme.flat != "true"}
      on:click={() =>
        ($customTheme.flat = $customTheme.flat == "true" ? "false" : "true")}
      aria-label="Disable Shadows"
      data-tooltip="Flat"
      role="checkbox"
      aria-checked={$customTheme.flat == "true"}
    >
      <Icon class="h-4 w-4" icon={faFillDrip} />
    </button>

    <button
      class="field flex items-center justify-center"
      class:active={$customTheme.instant == "true"}
      class:bg-body={$customTheme.instant != "true"}
      on:click={() =>
        ($customTheme.instant =
          $customTheme.instant == "true" ? "false" : "true")}
      aria-label="Disable Transitions"
      data-tooltip="Instant"
      role="checkbox"
      aria-checked={$customTheme.instant == "true"}
    >
      <Icon class="h-4 w-4" icon={faClock} />
    </button>

    <button
      class="field flex items-center justify-center"
      class:active={$customTheme.sharp == "true"}
      class:bg-body={$customTheme.sharp != "true"}
      on:click={() =>
        ($customTheme.sharp = $customTheme.sharp == "true" ? "false" : "true")}
      aria-label="Enable Sharp Mode"
      data-tooltip="Sharp"
      role="checkbox"
      aria-checked={$customTheme.sharp == "true"}
    >
      <Icon class="h-4 w-4" icon={faSquareFull} />
    </button>

    <button
      class="field flex items-center justify-center bg-body"
      on:click={toggle}
      aria-label="Toggle Color Scheme"
      data-tooltip="Theme"
    >
      <Icon class="h-4 w-4" icon={$isDark ? faSun : faMoon} />
    </button>
  </div>

  <div class="grid grid-cols-2">
    {#each [themeable1, themeable2] as themeable}
      <div class="flex flex-col gap-1">
        {#each themeable as { css: cssOg, name }}
          {#if cssOg.startsWith("#")}
            <h2 class="mt-4 pl-6 font-semibold">{name}</h2>
          {:else}
            {@const css = ($isDark ? "--dark-" : "--light-") + cssOg.slice(2)}
            {@const id = "theme-editor-" + css}

            <div class="group flex gap-2">
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
                class="h-6 w-6 overflow-hidden rounded-sm border-0 color-swatch-wrapper:p-0 color-swatch:border-0"
                type="color"
                {id}
                value={$customTheme[css] || getColor(css)}
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

              <label class="ml-2 flex-1" for={id}>{name}</label>
            </div>
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
