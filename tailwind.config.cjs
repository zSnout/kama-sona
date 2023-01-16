// @ts-check

const forms = require("@tailwindcss/forms")
const plugin = require("tailwindcss/plugin")

/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  safelist: [
    {
      pattern:
        /^icon-(?:bg-|fill-|text-)?(?:red|green|blue|purple|gray|slate)$/,
    },
    { pattern: /^bg-(?:red|green|blue|purple|gray|slate)-200$/ },
    {
      pattern: /^bg-(?:red|green|blue|purple|gray|slate)-900$/,
      variants: ["dark"],
    },
    { pattern: /^shadow-(?:red|green|blue|purple|gray|slate)-100$/ },
    {
      pattern: /^border-(?:red|green|blue|purple|gray|slate)-500$/,
      variants: ["hover"],
    },
    { pattern: /^text-(?:red|green|blue|purple|gray|slate)-500$/ },
    { pattern: /^text-(?:red|green|blue|purple|gray|slate)-700$/ },
    {
      pattern: /^text-(?:red|green|blue|purple|gray|slate)-300$/,
      variants: ["dark"],
    },
    { pattern: /^ring-(?:red|green|blue|purple|gray|slate)-500$/ },
    { pattern: /^border-standard$/, variants: ["focus-within"] },
  ],
  plugins: [
    forms,
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-active": { "background-color": "var(--bg-active)" },
        ".bg-active-hover": { "background-color": "var(--bg-active-hover)" },
        ".bg-body": { "background-color": "var(--bg-body)" },
        ".bg-field": { "background-color": "var(--bg-field)" },
        ".bg-filter": { "background-color": "var(--bg-filter)" },
        ".bg-filter-active": { "background-color": "var(--bg-filter-active)" },
        ".bg-hover": { "background-color": "var(--bg-hover)" },
        ".bg-tooltip": { "background-color": "var(--bg-tooltip)" },
        ".bg-loading-bar": { "background-color": "var(--bg-loading-bar)" },
        ".bg-table-row": { "background-color": "var(--bg-table-row)" },

        ".big-button-bg": { "background-color": "var(--big-button-bg)" },
        ".big-button-border": { "border-color": "var(--big-button-border)" },
        ".big-button-icon": { color: "var(--big-button-icon)" },
        ".big-button-text": { color: "var(--big-button-text)" },

        ".big-button-hover-bg": {
          "background-color": "var(--big-button-hover-bg)",
        },
        ".big-button-hover-border": {
          "border-color": "var(--big-button-hover-border)",
        },
        ".big-button-hover-icon": { color: "var(--big-button-hover-icon)" },
        ".big-button-hover-text": { color: "var(--big-button-hover-text)" },

        ".border-active": { "border-color": "var(--border-active)" },
        ".border-focus": { "border-color": "var(--border-focus)" },
        ".border-hover": { "border-color": "var(--border-hover)" },
        ".border-standard": { "border-color": "var(--border-standard)" },

        ".nav-bg": { "background-color": "var(--nav-bg)" },
        ".nav-border-b": { "border-bottom-color": "var(--nav-border)" },
        ".nav-icon-bg": { "background-color": "var(--nav-icon-bg)" },
        ".nav-icon-fill": { fill: "var(--nav-icon-fill)" },
        ".nav-icon-fill-active": { fill: "var(--nav-icon-fill-active)" },
        ".nav-icon-stroke": { stroke: "var(--nav-icon-stroke)" },

        ".ring-focus": { "--tw-ring-color": "var(--ring-focus)" },

        ".sidebar-bg": { "background-color": "var(--sidebar-bg)" },
        ".sidebar-border-l": { "border-left-color": "var(--sidebar-border)" },
        ".sidebar-button-color": {
          color: "var(--sidebar-button-color)",
        },
        ".sidebar-button-hover-bg": {
          "background-color": "var(--sidebar-button-hover-bg)",
        },
        ".sidebar-button-hover-color": {
          color: "var(--sidebar-button-hover-color)",
        },
        ".sidebar-opener-bg": {
          "background-color": "var(--sidebar-opener-bg)",
        },
        ".sidebar-opener-border": {
          "border-color": "var(--sidebar-opener-border)",
        },

        ".text-active": { color: "var(--text-active)" },
        ".text-body": { color: "var(--text-body)" },
        ".text-heading": { color: "var(--text-heading)" },
        ".text-icon": { color: "var(--text-icon)" },
        ".text-label": { color: "var(--text-label)" },
        ".text-link": { color: "var(--text-link)" },
        ".text-placeholder": { color: "var(--text-placeholder)" },
        ".text-tooltip": { color: "var(--text-tooltip)" },
      })
    }),
    plugin(
      ({ addUtilities, addVariant, matchComponents, matchVariant, theme }) => {
        addUtilities({
          ".hyphens": {
            hyphens: "auto",
          },
        })

        matchComponents(
          {
            icon: (value) => ({
              fill: value[200],
              stroke: value[500],
              strokeWidth: "16",
              ".dark &": {
                fill: value[700],
                stroke: value[300],
              },
            }),
            "icon-fill": (value) => ({
              fill: value[500],
            }),
            "icon-bg": (value) => ({
              backgroundColor: value[200],
              color: value[500],
              ".dark &": {
                backgroundColor: value[800],
              },
            }),
            "icon-text": (value) => ({
              color: value[500],
            }),
          },
          { values: theme("colors") }
        )

        matchComponents(
          {
            "prefer-w": (value) => ({
              width: value,
              maxWidth: "100%",
            }),
          },
          { values: { ...theme("width"), ...theme("maxWidth") } }
        )

        matchComponents({
          "transition-with": (value) => ({
            "transition-property":
              "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, " +
              value.replace(/_/g, " "),
            "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
            "transition-duration": "150ms",
          }),
        })

        addVariant("bafter", ["&:before", "&:after"])
        addVariant("scrollbar", ["&::-webkit-scrollbar"])
        addVariant("child", ["& > "])
        addVariant("color-swatch-wrapper", ["&::-webkit-color-swatch-wrapper"])
        addVariant("color-swatch", ["&::-webkit-color-swatch"])
        addVariant("sharp", [":where(html.sharp) &"])

        addVariant("focus", [
          "&:focus-within:where(:not(:focus))",
          "&:focus-visible",
        ])

        addVariant("peer-focus", [
          ".peer:focus-within:where(:not(:focus)) ~ &",
          ".peer:focus-visible ~ &",
        ])

        addVariant("group-focus", [
          ".group:focus-within:where(:not(:focus)) &",
          ".group:focus-visible &",
        ])

        matchVariant("desc", (value) => `& ${value.replace(/_/g, " ")}`)
        matchVariant("has", (value) => `&:has(${value.replace(/_/g, " ")})`)
        matchVariant("prev", (value) => `${value.replace(/_/g, " ")} + &`)
      }
    ),
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          // 400: 148 163 184
          // 500: 100 116 139
          // 450: 124 139 162
          450: "#7c8ba2",

          // 900: 15 23 42
          // 800: 30 41 59
          // 850: 22 32 50
          850: "#162032",
        },
        gray: {
          // 300: 209 213 219
          // 400: 156 163 175
          // 350: 182 188 197)
          350: "#b6bcc5",
        },
      },
      boxShadow: {
        "horiz-lg":
          "-10px 0 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      spacing: {
        22: "5.5rem",
        82: "20.5rem",
        84: "21rem",
      },
      strokeWidth: {
        16: "16",
      },
      gradientColorStops: {
        "border-standard": "var(--border-standard)",
        "bg-field": "var(--bg-field)",
      },
    },
    backdropOpacity: {},
    backgroundOpacity: {},
    borderOpacity: {},
    divideOpacity: {},
    placeholderOpacity: {},
    textOpacity: {},
  },
}

module.exports = config
