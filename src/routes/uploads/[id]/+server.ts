import { get } from "$lib/server/upload"
import { error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ params: { id } }) => {
  const result = await get(id)

  if (!result.ok) {
    throw error(404, `No upload exists called ${id}.`)
  }

  return new Response(result.value)
}) satisfies RequestHandler
