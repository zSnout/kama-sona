import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (({ cookies }) => {
  cookies.delete("session", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  throw redirect(302, "/log-in")
}) satisfies RequestHandler
