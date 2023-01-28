import { unwrapOr500 } from "$lib/result"
import { AccountList } from "$lib/server/account"
import type { PageServerLoad } from "./$types"

export const load = (async () => {
  const accounts = new AccountList({})

  return {
    accounts: unwrapOr500(
      await accounts.select({
        id: true,
        name: true,
        email: true,
      })
    ),
  }
}) satisfies PageServerLoad
