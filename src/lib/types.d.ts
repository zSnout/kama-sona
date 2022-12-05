/** Represents an HTML class that _must_ include a specific class. */
export type ClassNameWith<T extends string> =
  | T
  | `${T} ${string}`
  | `${string} ${T}`
  | `${string} ${T} ${string}`
