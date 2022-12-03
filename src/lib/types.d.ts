/** Expands type aliases within a type. Useful for debugging. */
export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type _OneOf<T, K extends keyof T> = K extends infer L extends keyof T
  ? Expand<
      Readonly<
        Record<L, T[L]> & Partial<Record<Exclude<keyof T, L>, undefined>>
      >
    >
  : never

/** A union of objects that each have one of the keys in {@link T}. */
export type OneOf<T> = _OneOf<T, keyof T>
