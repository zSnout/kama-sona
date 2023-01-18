// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface PageData {}
  // interface Platform {}

  interface Error {
    result?: import("$lib/result").Error
  }

  interface Locals {
    readonly account: import("@prisma/client").Account
  }
}

declare namespace svelte.JSX {
  interface HTMLProps<T> {
    "onfilter-disable"?: (event: Event) => void
  }
}

declare interface String {
  startsWith<T extends string>(text: T): this is `${T}${string}`
}
