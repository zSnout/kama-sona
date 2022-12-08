import { unwrapOr500 } from "$lib/result"
import * as Account from "$lib/server/account"
import { extractData } from "$lib/server/form"
import * as MagicLink from "$lib/server/magic-link"
import { error } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  async default({ request }) {
    const { email } = await extractData(request, ["email"] as const)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw error(400, "Your email address is invalid.")
    }

    if (unwrapOr500(await Account.count({ email })) == 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500)
      )

      return { email }
    }

    unwrapOr500(await MagicLink.create({ email }))
    unwrapOr500(await MagicLink.send({ email }))

    return { email }
  },
}
