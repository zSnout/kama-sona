import { browser } from "$app/environment"
import { writable } from "svelte-local-storage-store"
import { derived, get, readable } from "svelte/store"
import { disableTransitions } from "./disable-transitions"

/** A raw theme name in local storage. */
export type RawTheme = "dark" | "light" | "native"

/** The theme stored in local storage. */
export const rawTheme = writable<RawTheme>("theme", "native", {
  serializer: {
    parse: (text) => (text == "light" || text == "dark" ? text : "native"),
    stringify: (object) => "" + object,
  },
})

/** Whether the user's device has dark mode enabled. */
export const isDarkNative = readable(false, (set) => {
  if (browser && typeof matchMedia == "function") {
    const query = matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => set(query.matches)
    onChange()

    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }
})

/** Whether the user has dark mode enabled on kama sona. */
export const isDark = derived(
  [isDarkNative, rawTheme],
  ([$prefersDark, $rawTheme]) =>
    $rawTheme == "light" ? false : $rawTheme == "dark" ? true : $prefersDark
)

/** Toggles the user's preferred theme on kama sona. */
export function toggle() {
  // This function attempts to set the current theme to `native` whenever
  // possible. This matches the user's device theme when possible, but allows
  // them to pick a different theme specifically on kama sona.

  // First, we check if the user's device has dark mode enabled.
  const $isDarkNative = get(isDarkNative)

  // Then, we toggle their theme to be different from whatever it was previously.
  rawTheme.update(($rawTheme) => {
    if ($rawTheme == "dark") {
      // If the user's device has dark mode enabled, we have to set rawTheme to
      // "light." Otherwise, we can set it to "native."

      return $isDarkNative ? "light" : "native"
    } else if ($rawTheme == "light") {
      // If the user's device has dark mode disabled, we have to set rawTheme to
      // "dark." Otherwise, we can set it to "native."

      return $isDarkNative ? "native" : "dark"
    } else {
      // If the user is toggling from "native," we have to switch from the
      // native theme no matter what they're toggling to.

      return $isDarkNative ? "light" : "dark"
    }
  })
}

if (browser && typeof document == "object") {
  const root = document.documentElement.classList

  isDark.subscribe(($isDark) => {
    disableTransitions(() => {
      root.toggle("dark", $isDark)
    })
  })
}
