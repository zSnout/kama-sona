import { writable } from "svelte-local-storage-store"

export type ThemeableType = "active" | "bg" | "text"

export interface Themeable {
  readonly type: ThemeableType
  readonly css: `--${string}`
  readonly name: string
}

export interface Header {
  readonly type?: undefined
  readonly css: `#${string}`
  readonly name: string
}

export const themeable1: readonly (Themeable | Header)[] = [
  { css: "#common", name: "Common settings" },
  { css: "--text-body", name: "Text color", type: "text" },
  { css: "--text-icon", name: "Icon color", type: "text" },
  { css: "--text-label", name: "Label color", type: "text" },
  { css: "--bg-body", name: "Page background", type: "bg" },
  { css: "--bg-field", name: "Field background", type: "bg" },
  { css: "--bg-table-row", name: "Table row background", type: "bg" },
  { css: "--border-standard", name: "Border", type: "bg" },

  { css: "#bg", name: "Backgrounds" },
  { css: "--bg-active", name: "Active button", type: "active" },
  { css: "--bg-active-hover", name: "Hovered active button", type: "active" },
  { css: "--bg-body", name: "Page", type: "bg" },
  { css: "--bg-field", name: "Field", type: "bg" },
  { css: "--bg-filter", name: "Filter", type: "bg" },
  { css: "--bg-filter-active", name: "Active filter", type: "bg" },
  { css: "--bg-hover", name: "Hovered field", type: "bg" },
  { css: "--bg-loading-bar", name: "Loading bar", type: "active" },
  { css: "--bg-table-row", name: "Table row", type: "bg" },
  { css: "--bg-tooltip", name: "Tooltip", type: "bg" },
  { css: "--bg-chart", name: "Chart bar", type: "bg" },
  { css: "--bg-chart-active", name: "Active chart bar", type: "active" },

  { css: "#text", name: "Text colors" },
  { css: "--text-active", name: "Active button", type: "active" },
  { css: "--text-body", name: "Primary text", type: "text" },
  { css: "--text-chart-active", name: "Active chart label", type: "text" },
  { css: "--text-field", name: "Field", type: "text" },
  { css: "--text-heading", name: "Heading", type: "text" },
  { css: "--text-icon", name: "Icon", type: "text" },
  { css: "--text-label", name: "Label", type: "text" },
  { css: "--text-link", name: "Link", type: "active" },
  { css: "--text-placeholder", name: "Placeholder", type: "text" },
  { css: "--text-tooltip", name: "Tooltip", type: "text" },
]

export const themeable2: readonly (Themeable | Header)[] = [
  { css: "#border", name: "Borders" },
  { css: "--border-standard", name: "Standard", type: "bg" },
  { css: "--border-hover", name: "Hovered", type: "bg" },
  { css: "--border-focus", name: "Focused", type: "active" },
  { css: "--ring-focus", name: "Focus ring", type: "active" },
  { css: "--border-active", name: "Active", type: "active" },

  { css: "#big-button", name: "Big buttons" },
  { css: "--big-button-bg", name: "Background", type: "bg" },
  { css: "--big-button-border", name: "Border", type: "bg" },
  { css: "--big-button-icon", name: "Icon", type: "text" },
  { css: "--big-button-text", name: "Text", type: "text" },

  { css: "--big-button-hover-bg", name: "Hovered background", type: "bg" },
  { css: "--big-button-hover-border", name: "Hovered border", type: "bg" },
  { css: "--big-button-hover-icon", name: "Hovered icon", type: "text" },
  { css: "--big-button-hover-text", name: "Hovered text", type: "text" },

  { css: "#nav", name: "Navigation bar" },
  { css: "--nav-bg", name: "Background", type: "bg" },
  { css: "--nav-border", name: "Border", type: "bg" },
  { css: "--nav-icon-fill", name: "Navicon fill", type: "text" },
  { css: "--nav-icon-stroke", name: "Navicon outline", type: "text" },
  { css: "--nav-icon-fill-active", name: "Active navicon fill", type: "text" },
  { css: "--nav-icon-bg", name: "Active navicon background", type: "text" },

  { css: "#sidebar", name: "Sidebar" },
  { css: "--sidebar-bg", name: "Background", type: "bg" },
  { css: "--sidebar-outer-border", name: "Outer border", type: "bg" },
  { css: "--sidebar-inner-border", name: "Inner border", type: "bg" },
  { css: "--sidebar-button-color", name: "Button color", type: "text" },
  {
    css: "--sidebar-button-hover-bg",
    name: "Hovered button background",
    type: "bg",
  },
  {
    css: "--sidebar-button-hover-color",
    name: "Hovered button color",
    type: "text",
  },
]

export const themeable: readonly (Themeable | Header)[] = [
  ...themeable1,
  ...themeable2,
]

export type CustomTheme = {
  [css: string]: string | undefined
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
