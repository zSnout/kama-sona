import { error as svelteError } from "@sveltejs/kit"

/** The result of a fallible operation. */
export type Result<T> = Ok<T> | Error

/** A successful {@link Result} with a value of type {@link T}. */
export type Ok<T> = {
  readonly ok: true
  readonly value: T
  readonly error?: undefined
}

// Why not use a real {@link Error}? First off, it isn't serialized by
// SvelteKit. Second, it exposes a stack trace, which could be vulnerable to
// attacks.

/** A failed {@link Result} with an error message. */
export type Error = {
  readonly ok: false
  readonly value?: undefined
  readonly error: string
}

/** Creates a successful {@link Result}. */
export function ok(): Result<void>
export function ok<T>(value: T): Result<T>
export function ok<T>(value?: T): Result<T | undefined> {
  return { ok: true, value }
}

/** Creates an failed {@link Result} with an optional error message. */
export function error(error = "An error occurred."): Error {
  return { ok: false, error }
}

/** Maps the value of a successful {@link Result} or returns an errored one. */
export function map<T, U>(
  result: Result<T>,
  mapper: (value: T) => U
): Result<U> {
  if (result.ok) {
    return ok(mapper(result.value))
  } else {
    return result
  }
}

/** Maps a successful {@link Result} to another or returns an errored one. */
export function flatMap<T, U>(
  result: Result<T>,
  mapper: (value: T) => Result<U>
): Result<U> {
  if (result.ok) {
    return mapper(result.value)
  } else {
    return result
  }
}

/** Returns the first {@link Result} if it was successful. Otherwise, returns the second. */
export function or<A extends Result<unknown>, B extends Result<unknown>>(
  first: A,
  second: B
): A | B {
  if (first.ok) {
    return first
  }

  return second
}

/** Returns the first {@link Result} if it failed. Otherwise, returns the second. */
export function and<A extends Result<unknown>, B extends Result<unknown>>(
  first: A,
  second: B
): Error | B {
  if (!first.ok) {
    return first as Error
  }

  return second
}

/** Unwraps the value within a {@link Result} or returns a default value. */
export function unwrap<T>(result: Result<T>, defaultValue: T): T {
  if (result.ok) {
    return result.value
  } else {
    return defaultValue
  }
}

/**
 * Calls a function. If an error is thrown, `attempt` will return a failed
 * {@link Result}. If the function returns `null` or `undefined`, `attempt` will
 * return {@link defaultValue}.
 */
export function attempt<T extends {}>(
  fn: () => T | null | undefined,
  defaultValue: Result<T> = error("A function returned with no value.")
): Result<T> {
  try {
    const output = fn()

    if (output == null) {
      return defaultValue
    }

    return ok(output)
  } catch (err) {
    if (err == null) {
      return defaultValue
    }

    if (err instanceof Error) {
      return error(err.message)
    }

    return error(String(err))
  }
}

/** Unwraps a {@link Result} or throws a 500 error. */
export function unwrapOr500<T>(result: Result<T>) {
  if (result.ok) {
    return result.value
  } else {
    throw svelteError(500, result.error)
  }
}

/** Checks whether a given object is a {@link Result}. */
export function isResult(maybeResult: unknown): maybeResult is Result<unknown> {
  // We start with zero assumptions about the shape of `maybeResult`.
  if (
    maybeResult != null &&
    typeof maybeResult == "object" &&
    "ok" in maybeResult
  ) {
    // Now we know it's an object with an `ok` property.
    const ok = maybeResult.ok
    if (typeof ok == "boolean") {
      // Now we know `ok` is a boolean.
      if (
        ok &&
        "value" in maybeResult &&
        (!("error" in maybeResult) || typeof maybeResult.error === "undefined")
      ) {
        // And it has a `value` key with no `error`.
        return true
      }

      if (
        !ok &&
        "error" in maybeResult &&
        typeof maybeResult.error == "string" &&
        (!("value" in maybeResult) || typeof maybeResult.value === "undefined")
      ) {
        // And it has a `error` key with no `value`.
        return true
      }
    }
  }

  return false
}
