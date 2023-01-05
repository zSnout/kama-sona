import { unwrapOr500 } from "$lib/result"
import * as Resource from "$lib/server/resource"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const resource = unwrapOr500(await Resource.get({ id: params.id }))

  if (!resource.viewerIds.includes(account.id)) {
    throw error(503, "Sorry, you can't see somebody else's resource.")
  }

  return { resource }
}) satisfies PageServerLoad
