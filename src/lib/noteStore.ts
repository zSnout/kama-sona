import { writable } from "svelte-local-storage-store"
import { get } from "svelte/store"

export const note = writable("note", "")
export const setters = new Set<(value: string) => void>()

export function notifyOtherSetters(mySetter: (value: string) => void) {
  const value = get(note)

  setters.forEach((setter) => {
    if (setter !== mySetter) {
      setter(value)
    }
  })
}
