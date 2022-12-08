import { aOrAn } from "$lib/aOrAn"
import { error } from "@sveltejs/kit"

/**
 * Extracts specific keys from a form submission. Throws a 400 error if a key is
 * missing, empty, or a file instead of plain text.
 */
export async function extractData<T extends readonly string[]>(
  request: Request,
  keys: T
): Promise<Record<T[number], string>> {
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

  return output
}
