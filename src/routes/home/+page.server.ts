import { unwrapOr500 } from "$lib/result"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  return {
    id: account.id().then(unwrapOr500),
    permissions: account.permissions().all().then(unwrapOr500),
  }
}) satisfies PageServerLoad
