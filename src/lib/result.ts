import { error as svelteError, type HttpError } from "@sveltejs/kit"

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

/** Unwraps a {@link Result} or throws a 500 error. */
export function unwrapOr500<T>(result: Result<T>) {
  if (result.ok) {
    return result.value
  } else {
    throw Object.assign(
      svelteError(500, {
        message: result.error,
        result,
      })
    )
  }
}

/** Checks if a value is an error throw by {@link unwrapOr500}. */
export function isUnwrap500Error(
  error: unknown
): error is HttpError & { body: { result: Error } } {
  return (
    typeof error == "object" &&
    error != null &&
    "status" in error &&
    "body" in error &&
    "result" in error &&
    typeof error.result == "object" &&
    error.result != null &&
    "ok" in error.result &&
    error.result.ok === false &&
    "error" in error.result &&
    typeof error.result == "string"
  )
}

function unwrapOrThrow<U>(result: Result<U>): U {
  if (result.ok) {
    return result.value
  }

  throw result.error
}

/** Runs an asynchronous function with intermediate results. */
export function coroutine<T, A extends readonly unknown[]>(
  fn: (unwrap: <U>(result: Result<U>) => U, ...args: A) => Promise<T>
): (...args: A) => Promise<Result<T>> {
  return async (...args) => {
    try {
      return ok(await fn(unwrapOrThrow, ...args))
    } catch (err) {
      return error(err instanceof Error ? err.message : String(err))
    }
  }
}

export function voidify(result: Result<unknown>): Result<void> {
  if (!result.ok) {
    return result
  }

  return ok()
}
