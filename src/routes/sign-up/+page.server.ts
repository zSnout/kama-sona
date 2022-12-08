import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/form"
import * as UnverifiedAccount from "$lib/server/unverified-account"
import type { Actions } from "./$types"

export const actions: Actions = {
  async default({ request }) {
    const { email, name } = await extractData(request, [
      "email",
      "name",
    ] as const)

    const created = unwrapOr500(await UnverifiedAccount.create({ email, name }))
    unwrapOr500(await UnverifiedAccount.sendVerification(created))

    return { email, name }
  },
}
