import {
  PUBLIC_KS_APP_NAME,
  PUBLIC_KS_ENABLE_SIGN_UP,
} from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/extract"
import * as UnverifiedAccount from "$lib/server/unverified-account"
import { error } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (() => {
  if (PUBLIC_KS_ENABLE_SIGN_UP != "true") {
    throw error(
      503,
      `${PUBLIC_KS_APP_NAME} does not allow signing up for a new account.`
    )
  }
}) satisfies PageServerLoad

export const actions = {
  async default({ request }) {
    const { email, name } = await extractData(request, [
      "email",
      "name",
    ] as const)

    const created = unwrapOr500(await UnverifiedAccount.create({ email, name }))
    unwrapOr500(await UnverifiedAccount.sendVerification(created))

    return { email, name }
  },
} satisfies Actions
