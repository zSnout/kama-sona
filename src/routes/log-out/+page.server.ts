import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ cookies }) => {
  cookies.delete("session")

  throw redirect(302, "/log-in")
}
