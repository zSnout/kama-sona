import { unwrapOr500 } from "$lib/result"
import * as AssignmentStatus from "$lib/server/assignment-status"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const status = unwrapOr500(await AssignmentStatus.get({ id: params.id }))

  if (status.assigneeId != account.id) {
    throw error(
      503,
      "It looks like you're trying to see someone else's assignment! Well, okay. I uploaded their data at zsnout.com/?rr, just for you."
    )
  }

  return { status }
}) satisfies PageServerLoad
