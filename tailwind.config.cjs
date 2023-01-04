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
        /icon-(?:bg-|fill-|text-)?(?:red|orange|yellow|green|blue|purple)/,
    },
    { pattern: /bg-(?:red|orange|yellow|green|blue|purple)-200/ },
    {
      pattern: /bg-(?:red|orange|yellow|green|blue|purple)-900/,
      variants: ["dark"],
    },
    { pattern: /shadow-(?:red|orange|yellow|green|blue|purple)-100/ },
    {
      pattern: /border-(?:red|orange|yellow|green|blue|purple)-500/,
      variants: ["hover"],
    },
    { pattern: /text-(?:red|orange|yellow|green|blue|purple)-500/ },
    { pattern: /text-(?:red|orange|yellow|green|blue|purple)-700/ },
    {
      pattern: /text-(?:red|orange|yellow|green|blue|purple)-300/,
      variants: ["dark"],
    },
    { pattern: /ring-(?:red|orange|yellow|green|blue|purple)-500/ },
  ],
  plugins: [
    forms,
    plugin(({ addVariant, matchComponents, matchVariant, theme }) => {
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
      addVariant("focus-visible", [
        "&:focus-within:where(:not(:focus))",
        "&:focus-visible",
      ])

      matchVariant("has", (value) => `&:has(${value.replace(/_/g, " ")})`)
    }),
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          // 400: 148 163 184
          // 500: 100 116 139
          450: "rgb(124 139 162)",

          // 900: 15 23 42
          // 800: 30 41 59
          850: "rgb(22 32 50)",
        },
        gray: {
          // 300: 209 213 219
          // 400: 156 163 175
          350: "rgb(182 188 197)",
        },
      },
      spacing: {
        22: "5.5rem",
      },
    },
  },
}

module.exports = config
