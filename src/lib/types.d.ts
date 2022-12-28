/** Represents an HTML class that _must_ include a specific class. */
export type ClassNameWith<T extends string> =
  | T
  | `${T} ${string}`
  | `${string} ${T}`
  | `${string} ${T} ${string}`

/**
 * Forces TypeScript to look into a type to helps with IDE autocomplete, error
 * messages, and variables types.
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/** Converts a union to an intersection. Copied from @tiptap/core. */
export declare type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
