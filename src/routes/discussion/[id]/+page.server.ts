import { unwrapOr500 } from "$lib/result"
import * as Discussion from "$lib/server/discussion"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const discussion = unwrapOr500(await Discussion.get({ id: params.id }))

  if (!discussion.commenterIds.includes(account.id)) {
    throw error(503, "Sorry, you can't see somebody else's discussion.")
  }

  return { discussion }
}) satisfies PageServerLoad
