import { PUBLIC_KS_ADMIN_MODE } from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { Account, AccountList, permissions } from "$lib/server/account"
import { extractData } from "$lib/server/extract"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async () => {
  if (PUBLIC_KS_ADMIN_MODE != "true") {
    throw redirect(302, "/")
  }

  return {
    admins: unwrapOr500(
      await new AccountList({
        permissions: { has: "admin" },
      }).select({
        email: true,
      })
    ),
  }
}) satisfies PageServerLoad

export const actions = {
  async default({ request }) {
    if (PUBLIC_KS_ADMIN_MODE != "true") {
      throw error(503, "You do not have permission to access this page.")
    }

    const { email, name } = await extractData(request, [
      "email",
      "name",
    ] as const)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw error(400, "Your email address is invalid.")
    }

    return unwrapOr500(
      await unwrapOr500(
        await Account.create({
          email,
          name,
          permissions: permissions.slice(),
        })
      ).select({ email: true, name: true })
    )
  },
} satisfies Actions
