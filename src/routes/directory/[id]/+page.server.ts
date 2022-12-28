import { unwrapOr500 } from "$lib/result"
import { get } from "$lib/server/account"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params: { id } }) => {
  return {
    profile: unwrapOr500(await get({ id })),
  }
}) satisfies PageServerLoad
