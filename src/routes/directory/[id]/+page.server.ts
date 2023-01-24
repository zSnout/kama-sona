import { unwrapOr500 } from "$lib/result"
import { Account } from "$lib/server/account"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params: { id } }) => {
  const account = new Account({ id })

  return {
    profile: unwrapOr500(
      await account.select({
        email: true,
        name: true,
      })
    ),
  }
}) satisfies PageServerLoad
