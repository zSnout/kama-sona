import {
  PUBLIC_KS_APP_NAME,
  PUBLIC_KS_ENABLE_SIGN_UP,
} from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import * as Session from "$lib/server/session"
import * as UnverifiedAccount from "$lib/server/unverified-account"
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
  const { code } = unwrapOr500(await Session.get({ forId: account.id }))

  cookies.set("session", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  throw redirect(302, "/")
}) satisfies PageServerLoad
