import { unwrapOr500 } from "$lib/result"
import * as Account from "$lib/server/account"
import { extractData } from "$lib/server/form"
import * as Group from "$lib/server/group"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  async default({ cookies, request }) {
    const account = unwrapOr500(await Account.getFromCookies(cookies))
    const { name } = await extractData(request, ["name"] as const)

    unwrapOr500(
      await Group.create({
        group: { name },
        manager: { id: account.id },
      })
    )

    throw redirect(302, "/groups")
  },
}
