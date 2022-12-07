import { error, isResult, ok, type Error, type Ok, type Result } from "./result"

/**
 * Asynchronously calls a function. If an error is thrown, `attempt` will return
 * a failed {@link Result}. If the function returns `null` or `undefined`,
 * `attempt` will return {@link defaultValue}.
 */
export async function attempt<T extends {}>(
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

/** Asynchronously maps a {@link Result} using flatMap semantics. */
export async function flatMap<T, U>(
  result: Result<T>,
  mapper: (value: T) => Result<U> | PromiseLike<Result<U>>
): Promise<Result<U>> {
  if (result.ok) {
    return mapper(result.value)
  } else {
    return result
  }
}

/** A type that awaits an asynchronous {@link Result} and returns its inner type. */
export type Awaited<T> =
  /** Thanks to the TS {@link globalThis.Result Result} type for existing. */
  T extends object & {
    then(onfulfilled: infer F, ...args: infer _): any
  }
    ? F extends (value: infer V, ...args: infer _) => any
      ? Awaited<V>
      : never
    : T extends Ok<infer U>
    ? Awaited<U>
    : T extends Error
    ? never
    : T

function await_<T>(result: T): Promise<Result<Awaited<T>>>
async function await_(result: unknown): Promise<Result<unknown>> {
  try {
    let value = result

    while (true) {
      value = await value

      if (isResult(value)) {
        if (value.ok) {
          value = value.value
          continue
        } else {
          return value
        }
      } else {
        return ok(value)
      }
    }
  } catch (err) {
    return error(String(err))
  }
}

/** A type that unwraps result within an array. */
export type UnwrapResults<T extends readonly unknown[]> = {
  [K in keyof T]: Awaited<T[K]>
}

/**
 * Takes a list of possible asynchronous {@link Result}s and returns a result
 * with their values. If any {@link Result} fails, the entire output fails.
 */
export function all<T extends readonly unknown[]>(
  results: T
): Promise<Result<UnwrapResults<T>>> {
  return new Promise((resolve) => {
    const output: unknown[] = Array(results.length) as any
    let completed = 0

    results.forEach(async (result, index) => {
      const value = await await_(result)

      completed++

      if (value.ok) {
        output[index] = value.value
      } else {
        return resolve(value)
      }

      if (completed == results.length) {
        resolve(ok(output as any))
      }
    })
  })
}

export { await_ as await }
