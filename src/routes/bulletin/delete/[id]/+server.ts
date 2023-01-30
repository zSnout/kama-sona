import { unwrapOr500 } from "$lib/result"
import { Bulletin } from "$lib/server/bulletin"
import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ locals: { account }, params: { id } }) => {
  const myId = unwrapOr500(await account.id())

  const bulletin = new Bulletin({ id })
  const { authorId } = unwrapOr500(await bulletin.select({ authorId: true }))

  if (myId != authorId) {
    throw error(503, "You can't delete somebody else's bulletin.")
  }

  unwrapOr500(await bulletin.delete())

  throw redirect(303, "/")
}) satisfies RequestHandler
