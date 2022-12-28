import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (({ cookies }) => {
  cookies.delete("session", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  throw redirect(302, "/log-in")
}) satisfies PageServerLoad
