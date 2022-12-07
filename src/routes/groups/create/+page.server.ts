import * as AsyncResult from "$lib/async-result"
import { unwrapOr500 } from "$lib/result"
import * as Account from "$lib/server/account"
import { extractData } from "$lib/server/form"
import { create } from "$lib/server/group"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  async default({ cookies, request }) {
    const [account, { name }] = unwrapOr500(
      await AsyncResult.all([
        Account.getFromCookies(cookies),
        extractData(request, ["name"] as const),
      ])
    )

    unwrapOr500(
      await create({
        group: { name },
        manager: { id: account.id },
      })
    )

    throw redirect(302, "/groups")
  },
}
