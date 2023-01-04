import { PUBLIC_KS_BYPASS_LOGIN } from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import * as Account from "$lib/server/account"
import { extractData } from "$lib/server/extract"
import * as MagicLink from "$lib/server/magic-link"
import * as Session from "$lib/server/session"
import { error, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async default({ cookies, request }) {
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

    if (PUBLIC_KS_BYPASS_LOGIN == "true") {
      const account = unwrapOr500(await Account.get({ email }))
      const { code } = unwrapOr500(await Session.get({ forId: account.id }))

      cookies.set("session", code, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })

      throw redirect(303, "/")
    }

    unwrapOr500(await MagicLink.create({ email }))
    unwrapOr500(await MagicLink.send({ email }))

    return { email }
  },
} satisfies Actions
