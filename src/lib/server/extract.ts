import { error } from "@sveltejs/kit"
import { aOrAn } from "../aOrAn"
import type { Expand, UnionToIntersection } from "../types"

/** The common interface all form extractors must implement. */
export type Extractor<T extends object> = (data: FormData) => T

/** Extracts the value of a single field. */
export function field<K extends string>(
  key: K
): Extractor<Record<K, readonly FormDataEntryValue[]>> {
  return (data) =>
    ({ [key]: data.getAll(key) } as Record<K, FormDataEntryValue[]>)
}

/** Extracts the value of a single text field. */
export function text<K extends string>(key: K): Extractor<Record<K, string>> {
  const base = field(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value.length == 0) {
      throw error(400, `The ${key} property wasn't sent to the server.`)
    }

    if (value.length != 1) {
      throw error(400, `The ${key} property was sent multiple times.`)
    }

    if (typeof value[0] == "string") {
      return { [key]: value[0] } as Record<K, string>
    }

    throw error(400, `The ${key} property was a file; expected a string.`)
  }
}

/** Extracts the value of a single text field. */
export function number<K extends string>(key: K): Extractor<Record<K, number>> {
  const base = field(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value.length == 0) {
      throw error(400, `The ${key} property wasn't sent to the server.`)
    }

    if (value.length != 1) {
      throw error(400, `The ${key} property was sent multiple times.`)
    }

    if (typeof value[0] == "string") {
      if (Number.isNaN(+value[0])) {
        throw error(400, `The ${key} property was text; expected a number.`)
      }

      return { [key]: +value[0] } as Record<K, number>
    }

    throw error(400, `The ${key} property was a file; expected a string.`)
  }
}

/** Extracts the values of a many-valued text field. */
export function multiText<K extends string>(
  key: K
): Extractor<Record<K, [string, ...string[]]>> {
  const base = field(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value.length == 0) {
      throw error(400, `The ${key} property wasn't sent to the server.`)
    }

    const output: string[] = []

    for (const item of value) {
      if (typeof item != "string") {
        throw error(
          400,
          `The ${key} property included a file; expected a string.`
        )
      }

      output.push(item)
    }

    return { [key]: output } as Record<K, [string, ...string[]]>
  }
}

/** Extracts the value of a single text field. */
export function date<K extends string>(key: K): Extractor<Record<K, Date>> {
  const base = text(key)

  return (data) => {
    const { [key]: value } = base(data)
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      throw error(400, `The ${key} property `)
    }

    return { [key]: date } as Record<K, Date>
  }
}

/** Extracts the value of a boolean field. */
export function boolean<K extends string>(
  key: K
): Extractor<Record<K, boolean>> {
  const base = text(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value == "true" || value == "false") {
      return { [key]: value == "true" ? true : false } as Record<K, boolean>
    }

    throw error(
      400,
      `Expected a boolean field ${key}; received value ${value}.`
    )
  }
}

/** Makes an extractor optional. */
export function optional<K extends string, T>(
  key: K,
  extractor: (key: K) => Extractor<Record<K, T>>
): Extractor<Record<K, T | undefined>> {
  const base = field(key)
  const standard = extractor(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value.length == 0) {
      return { [key]: undefined } as Record<K, undefined>
    }

    return standard(data)
  }
}

/** Extracts a list of files. */
export function files<K extends string>(key: K): Extractor<Record<K, File[]>> {
  const base = field(key)

  return (data) => {
    const { [key]: value } = base(data)

    if (value.length == 0) {
      throw error(400, `The ${key} property wasn't sent to the server.`)
    }

    const output: File[] = []

    for (const item of value) {
      if (!(item instanceof Blob)) {
        throw error(
          400,
          `The ${key} property included a file; expected a string.`
        )
      }

      if (item.size > 0) {
        output.push(item)
      }
    }

    return { [key]: output } as Record<K, File[]>
  }
}

/** Combines the results from multiple extractors. */
export function combine<T extends readonly Extractor<object>[]>(
  ...extractors: T
): Extractor<
  Expand<
    Readonly<
      UnionToIntersection<T[number] extends Extractor<infer U> ? U : never>
    >
  >
> {
  return (data) => {
    const output = Object.create(null)

    for (const extractor of extractors) {
      Object.assign(output, extractor(data))
    }

    return output
  }
}

/** Extracts form data from a {@link Request}. */
export function fromRequest<T extends object>(
  extractor: Extractor<T>
): (request: Request) => Promise<T> {
  return async (request) => {
    return await extractor(await request.formData())
  }
}

/**
 * Extracts specific keys from a form submission. Throws a 400 error if a key is
 * missing, empty, or a file instead of plain text.
 */
export async function extractData<T extends readonly string[]>(
  request: Request,
  keys: T
): Promise<Expand<Record<T[number], string>>> {
  const output: Record<T[number], string> = Object.create(null)

  const data = await request.formData()

  for (const key of keys) {
    const value = data.get(key)

    if (value == null || value == "") {
      throw error(400, `It looks like you didn't submit ${aOrAn(key)} ${key}.`)
    }

    if (typeof value != "string") {
      throw error(
        400,
        `It looks like you submitted a file instead of a plain text ${key}.`
      )
    }

    output[key as T[number]] = value
  }

  return output as unknown as Expand<typeof output>
}
