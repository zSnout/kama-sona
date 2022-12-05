import { unwrapOr500 } from "$lib/result"
import * as MagicLink from "$lib/server/magic-link"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ cookies, params }) => {
  const account = unwrapOr500(await MagicLink.verify(params))

  cookies.set("session", account.session, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  throw redirect(302, "/")
}
