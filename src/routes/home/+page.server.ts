import { unwrapOr500 } from "$lib/result"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  return {
    permissions: account.permissions().all().then(unwrapOr500),
  }
}) satisfies PageServerLoad
