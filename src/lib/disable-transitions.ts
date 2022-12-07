import { browser } from "$app/environment"

/** Disables transitions while the provided function is running. */
export function disableTransitions(fn: () => PromiseLike<unknown> | unknown) {
  if (!browser) {
    fn()
    return
  }

  const root = document.documentElement.classList

  root.add("no-transitions")

  requestAnimationFrame(async () => {
    await fn()

    requestAnimationFrame(() => {
      root.remove("no-transitions")
    })
  })
}
