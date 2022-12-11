import { unwrapOr500 } from "$lib/result"
import * as Account from "$lib/server/account"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ parent }) => {
  const { isManager } = await parent()

  if (!isManager) {
    throw error(503, "You must be a group manager to add members.")
  }

  return {
    accounts: unwrapOr500(await Account.getAll()),
    isManager: true as const,
  }
}
