import { unwrapOr500 } from "$lib/result"
import { MagicLink } from "$lib/server/magic-link"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ cookies, params }) => {
  const account = unwrapOr500(await MagicLink.verify(params.code))
  const session = unwrapOr500(await account.session())
  const { code } = unwrapOr500(await session.select({ code: true }))

  cookies.set("session", code, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  throw redirect(302, "/")
}) satisfies PageServerLoad
