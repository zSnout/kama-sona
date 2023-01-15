import { writable } from "svelte-local-storage-store"

export interface Themeable {
  readonly type?: undefined
  readonly css: string
  readonly name: string
}

export interface Header {
  readonly css: `#${string}`
  readonly name: string
}

export const themeable1 = [
  { css: "#common", name: "Common settings" },
  { css: "--text-body", name: "Text color" },
  { css: "--text-icon", name: "Icon color" },
  { css: "--text-label", name: "Label color" },
  { css: "--bg-body", name: "Page background" },
  { css: "--bg-field", name: "Field background" },
  { css: "--bg-table-row", name: "Table row background" },
  { css: "--border-standard", name: "Border" },

  { css: "#bg", name: "Backgrounds" },
  { css: "--bg-active", name: "Active button background" },
  { css: "--bg-active-hover", name: "Hovered active button" },
  { css: "--bg-body", name: "Page background" },
  { css: "--bg-field", name: "Field background" },
  { css: "--bg-filter", name: "Filter background" },
  { css: "--bg-filter-active", name: "Active filter background" },
  { css: "--bg-hover", name: "Hovered field background" },
  { css: "--bg-loading-bar", name: "Loading bar" },
  { css: "--bg-table-row", name: "Table row background" },
  { css: "--bg-tooltip", name: "Tooltip background" },

  { css: "#text", name: "Text colors" },
  { css: "--text-active", name: "Active button" },
  { css: "--text-body", name: "Primary text" },
  { css: "--text-heading", name: "Heading" },
  { css: "--text-icon", name: "Icon" },
  { css: "--text-label", name: "Label" },
  { css: "--text-link", name: "Link" },
  { css: "--text-placeholder", name: "Placeholder" },
  { css: "--text-tooltip", name: "Tooltip" },
]

export const themeable2 = [
  { css: "#border", name: "Borders" },
  { css: "--border-active", name: "Active button border" },
  { css: "--border-focus", name: "Focused button border" },
  { css: "--border-hover", name: "Hovered button border" },
  { css: "--border-standard", name: "Border" },
  { css: "--ring-focus", name: "Focus ring" },

  { css: "#big-button", name: "Big buttons" },
  { css: "--big-button-bg", name: "Background" },
  { css: "--big-button-border", name: "Border" },
  { css: "--big-button-icon", name: "Icon" },
  { css: "--big-button-text", name: "Text" },

  { css: "--big-button-hover-bg", name: "Hovered background" },
  { css: "--big-button-hover-border", name: "Hovered border" },
  { css: "--big-button-hover-icon", name: "Hovered icon" },
  { css: "--big-button-hover-text", name: "Hovered text" },

  { css: "#nav", name: "Navigation bar" },
  { css: "--nav-bg", name: "Background" },
  { css: "--nav-border", name: "Border" },
  { css: "--nav-icon-fill", name: "Navicon fill" },
  { css: "--nav-icon-fill-active", name: "Active navicon fill" },
  { css: "--nav-icon-stroke", name: "Navicon outline" },
  { css: "--nav-icon-bg", name: "Hovered navicon background" },

  { css: "#sidebar", name: "Sidebar" },
  { css: "--sidebar-bg", name: "Background" },
  { css: "--sidebar-border", name: "Border" },
  { css: "--sidebar-button-color", name: "Button color" },
  {
    css: "--sidebar-button-hover-bg",
    name: "Hovered button background",
  },
  {
    css: "--sidebar-button-hover-color",
    name: "Hovered button color",
  },
]

export const themeable: readonly (Themeable | Header)[] = [
  ...themeable1,
  ...themeable2,
]

export type CustomTheme = {
  [css: string]: string | undefined
  sharp?: string | undefined
}

export const customTheme = writable<CustomTheme>(
  "custom-theme",
  {},
  {
    serializer: {
      parse: (text) => {
        try {
          const parsed: unknown = JSON.parse(text)

          if (typeof parsed == "object" && parsed) {
            const output: CustomTheme = {}

            for (const key in parsed) {
              const value: unknown = parsed[key as keyof typeof parsed]

              if (typeof value == "string") {
                output[key] = value
              }
            }

            return output
          }

          return {}
        } catch {
          return {}
        }
      },
      stringify: JSON.stringify,
    },
  }
)
