import { unwrapOr500 } from "$lib/result"
import * as MagicLink from "$lib/server/magic-link"
import * as Session from "$lib/server/session"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ cookies, params }) => {
  const account = unwrapOr500(await MagicLink.verify(params))
  const { code } = unwrapOr500(await Session.get({ forId: account.id }))

  cookies.set("session", code, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  throw redirect(302, "/")
}) satisfies PageServerLoad
