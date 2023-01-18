import { unwrapOr500 } from "$lib/result"
import { get } from "$lib/server/card-deck"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params: { id } }) => {
  const deck = unwrapOr500(await get({ id }))

  if (deck.managerId === account.id) {
    return { ...deck, writable: true }
  }

  if (deck.public) {
    return { ...deck, writable: false }
  }

  throw error(503, "You do not have permission to view this card deck.")
}) satisfies PageServerLoad
