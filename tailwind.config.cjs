// @ts-check

const forms = require("@tailwindcss/forms")
const typography = require("@tailwindcss/typography")
const plugin = require("tailwindcss/plugin")

/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  plugins: [
    forms,
    typography,
    plugin(function ({ matchComponents, theme }) {
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
          "icon-bg": (value) => ({
            backgroundColor: value[200],
            color: value[500],
            ".dark &": {
              backgroundColor: value[800],
            },
          }),
        },
        { values: theme("colors") }
      )

      matchComponents(
        { "prefer-w": (value) => ({ width: value, maxWidth: "100%" }) },
        { values: theme("width") }
      )
    }),
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          // 900: 15 23 42
          // 800: 30 41 59
          850: "rgb(22 32 50)",
        },
      },
    },
  },
}

module.exports = config
