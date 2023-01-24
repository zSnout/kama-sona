<script lang="ts">
  import {
    faClock,
    faDownload,
    faFillDrip,
    faMoon,
    faSquareFull,
    faSun,
    faTrash,
    faUpload,
  } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"
  import { isDark, toggle } from "./theme"
  import { customTheme } from "./themeable"
  import ThemeEditorCustomColors from "./ThemeEditorCustomColors.svelte"
  import ThemeEditorRepaint from "./ThemeEditorRepaint.svelte"

  let className = ""
  export { className as class }

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

<div
  class="{className} flex flex-col overflow-auto px-3 py-6"
  on:contextmenu|preventDefault
>
  <h1 class="sr-only">Theme Editor</h1>

  <div class="mb-6 flex w-full justify-center gap-3">
    <button
      class="field flex items-center justify-center bg-body"
      on:click={() => {
        const style = $isDark ? "dark" : "light"

        if (confirm(`Are you sure you want to reset your ${style} theme?`)) {
          customTheme.update(($customTheme) => {
            for (const key in $customTheme) {
              if (key.startsWith(`--${style}-`)) {
                delete $customTheme[key]
              }
            }

            return $customTheme
          })
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

  <ThemeEditorRepaint />

  <ThemeEditorCustomColors />
</div>
