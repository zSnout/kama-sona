const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const nesting = require("tailwindcss/nesting")

/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: [nesting, tailwindcss(), autoprefixer],
}

module.exports = config
