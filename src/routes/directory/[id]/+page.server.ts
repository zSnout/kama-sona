import { unwrapOr500 } from "$lib/result"
import { get } from "$lib/server/account"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ parent, params }) => {
  const { account } = await parent()

  if (!account) {
    throw redirect(302, "/log-in")
  }

  return { profile: unwrapOr500(await get({ id: params.id })) }
}
