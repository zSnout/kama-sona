const forms = require("@tailwindcss/forms")
const typography = require("@tailwindcss/typography")

/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  plugins: [forms, typography],
  theme: { extend: {} },
}

module.exports = config
