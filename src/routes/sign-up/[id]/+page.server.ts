import {
  PUBLIC_KS_APP_NAME,
  PUBLIC_KS_ENABLE_SIGN_UP,
} from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { UnverifiedAccount } from "$lib/server/unverified-account"
import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ cookies, params }) => {
  if (PUBLIC_KS_ENABLE_SIGN_UP != "true") {
    throw error(
      503,
      `${PUBLIC_KS_APP_NAME} does not allow signing up for a new account.`
    )
  }

  const account = unwrapOr500(await UnverifiedAccount.verify(params.id))
  const session = unwrapOr500(await account.session())
  const { code } = unwrapOr500(await session.select({ code: true }))

  cookies.set("session", code, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  throw redirect(302, "/")
}) satisfies PageServerLoad
