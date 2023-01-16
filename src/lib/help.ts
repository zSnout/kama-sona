import type { Action } from "svelte/action"

export const help: Action<HTMLElement, void> = (el) => {
  function update() {
    const target = document.getElementById("help")

    if (!target) {
      return
    }

    target.appendChild(el)
    el.hidden = false
  }

  setTimeout(update)

  return {
    update,
    destroy() {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
        el.hidden = true
      }
    },
  }
}
