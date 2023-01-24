import { unwrapOr500 } from "$lib/result"
import { AccountList } from "$lib/server/account"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ parent }) => {
  const { isManager } = await parent()

  if (!isManager) {
    throw error(503, "You must be a group manager to add members.")
  }

  const accounts = new AccountList({})

  return {
    accounts: unwrapOr500(
      await accounts.select({
        id: true,
        name: true,
        email: true,
      })
    ),
    isManager: true as const,
  }
}) satisfies PageServerLoad
