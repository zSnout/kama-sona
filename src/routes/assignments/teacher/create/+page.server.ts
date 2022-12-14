import { unwrapOr500 } from "$lib/result"
import * as Group from "$lib/server/group"
import * as Category from "$lib/server/category"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ parent }) => {
  const { account } = await parent()

  if (!account) {
    throw redirect(302, "/log-in")
  }

  return {
    groups: unwrapOr500(
      await Category.getAllForGroupWithManager({ id: account.id })
    ),
  }
}
