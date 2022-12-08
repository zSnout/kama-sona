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

/** Unwraps a {@link Result} or throws a 500 error. */
export function unwrapOr500<T>(result: Result<T>) {
  if (result.ok) {
    return result.value
  } else {
    throw svelteError(500, result.error)
  }
}

/** Used to make sure that errors inside of coroutines are detected properly. */
class CoroutineError {
  constructor(readonly error: Error) {}
}

/**
 * Unwraps a {@link Result}'s value, or throws a {@link CoroutineError} if the
 * result is a failure.
 */
const coroutineUnwrap = <T>(value: Result<T>): T => {
  if (value.ok) {
    return value.value
  }

  throw new CoroutineError(value)
}

/**
 * Wraps a function and makes working with {@link Result}s within it easier. To
 * use it, pass a function that takes an `unwrap` function and, optionally,
 * other arguments. Then, unwrap the value of {@link Result}s using the `unwrap`
 * function. If an {@link Error} is passed to `unwrap`, the coroutine will
 * result that error. If an {@link Ok} is passed, its value will be returned.
 *
 * If your coroutine is asynchronous, use {@link asyncCoroutine} instead of `coroutine`.
 *
 * Do not return a {@link Result} from your coroutine. If you need to return an
 * {@link Error}, call `unwrap` with the error as your value.
 *
 * @example
 * ```ts
 * const getUserDescription = coroutine((unwrap, name: Result<string>, age: number) =>
 *   `${unwrap(name)} is ${age} years old.`
 * )
 *
 * const value1 = getUserDescription(ok("Steve"), 27)
 * // value1 is Ok "Steve is 27 years old."
 *
 * const value2 = getUserDescription(error("Unknown user name."), 27)
 * // value2 is Error "Unknown user name."
 * ```
 */
export function coroutine<A extends readonly unknown[], R extends unknown>(
  fn: (unwrap: <T>(value: Result<T>) => T, ...args: A) => R
): (...args: A) => Result<R> {
  return function coroutine(...args: A): Result<R> {
    try {
      return ok(fn(coroutineUnwrap, ...args))
    } catch (error) {
      if (error instanceof CoroutineError) {
        return error.error
      } else {
        throw error
      }
    }
  }
}

/**
 * Wraps a function and makes working with {@link Result}s within it easier. To
 * use it, pass a function that takes an `unwrap` function and, optionally,
 * other arguments. Then, unwrap the value of {@link Result}s using the `unwrap`
 * function. If an {@link Error} is passed to `unwrap`, the coroutine will
 * result that error. If an {@link Ok} is passed, its value will be returned.
 *
 * If your coroutine is synchronous, use {@link coroutine} instead of `asyncCoroutine`.
 *
 * Do not return a {@link Result} from your async coroutine. If you need to return an
 * {@link Error}, call `unwrap` with the error as your value.
 *
 * @example
 * ```ts
 * const getUserDescription = asyncCoroutine(
 *   async (unwrap, name: Promise<Result<string>>, age: number) =>
 *     `${unwrap(await name)} is ${age} years old.`
 * )
 *
 * const value1 = await getUserDescription(Promise.resolve(ok("Steve")), 27)
 * // value1 is Ok "Steve is 27 years old."
 *
 * const value2 = await getUserDescription(Promise.resolve(error("Unknown user name.")), 27)
 * // value2 is Error "Unknown user name."
 * ```
 */
export function asyncCoroutine<A extends readonly unknown[], R extends unknown>(
  fn: (unwrap: <T>(value: Result<T>) => T, ...args: A) => PromiseLike<R> | R
): (...args: A) => Promise<Result<R>> {
  return async function coroutine(...args: A): Promise<Result<R>> {
    try {
      return ok(await fn(coroutineUnwrap, ...args))
    } catch (error) {
      if (error instanceof CoroutineError) {
        return error.error
      } else {
        throw error
      }
    }
  }
}
