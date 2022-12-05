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

/** Asynchronously maps a {@link Result} using {@link flatMap} semantics. */
export async function asyncFlatMap<T, U>(
  result: Result<T>,
  mapper: (value: T) => Result<U> | PromiseLike<Result<U>>
): Promise<Result<U>> {
  if (result.ok) {
    return mapper(result.value)
  } else {
    return result
  }
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

/**
 * Asynchronously calls a function. If an error is thrown, `attempt` will return
 * a failed {@link Result}. If the function returns `null` or `undefined`,
 * `attempt` will return {@link defaultValue}.
 */
export async function attemptAsync<T extends {}>(
  fn: () => T | null | undefined | PromiseLike<T | null | undefined>,
  defaultValue: Result<T> = error("A function returned with no value.")
): Promise<Result<T>> {
  try {
    const output = await fn()

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

/**
 * Requires both results to be successful. If they are, the value of the second
 * result is returned.
 */
export function both<A, B>(first: Result<A>, second: Result<B>): Result<B> {
  if (!first.ok) {
    return first
  }

  return second
}
