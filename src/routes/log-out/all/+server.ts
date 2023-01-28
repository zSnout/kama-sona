import { unwrapOr500 } from "$lib/result"
import { Session } from "$lib/server/session"
import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ locals: { account }, cookies }) => {
  unwrapOr500(await Session.create({ for: { connect: account.filter } }))

  cookies.delete("session", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  throw redirect(302, "/log-in")
}) satisfies RequestHandler
