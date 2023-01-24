import { PUBLIC_KS_BYPASS_LOGIN } from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { Account, AccountList } from "$lib/server/account"
import { extractData } from "$lib/server/extract"
import { MagicLink } from "$lib/server/magic-link"
import { error, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async default({ cookies, request }) {
    const { email } = await extractData(request, ["email"] as const)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw error(400, "Your email address is invalid.")
    }

    const accountsWithEmail = unwrapOr500(
      await new AccountList({ email }).count()
    )

    if (accountsWithEmail == 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500)
      )

      return { email }
    }

    if (PUBLIC_KS_BYPASS_LOGIN == "true") {
      const session = unwrapOr500(await new Account({ email }).session())
      const { code } = unwrapOr500(await session.select({ code: true }))

      cookies.set("session", code, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })

      throw redirect(303, "/")
    }

    const link = unwrapOr500(
      await MagicLink.create({ for: { connect: { email } } })
    )

    unwrapOr500(await link.sendVerificationEmail())

    return { email }
  },
} satisfies Actions
