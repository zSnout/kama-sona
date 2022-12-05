import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/form"
import * as MagicLink from "$lib/server/magic-link"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ parent }) => {
  if ((await parent()).account) {
    throw redirect(302, "/")
  }
}

export const actions: Actions = {
  async default({ request }) {
    const { email } = await extractData(request, ["email"] as const)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw error(400, "Your email address is invalid.")
    }

    unwrapOr500(await MagicLink.create({ email }))
    unwrapOr500(await MagicLink.send({ email }))

    return { success: true as const, email }
  },
}
