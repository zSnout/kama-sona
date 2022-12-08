import { PUBLIC_KS_ADMIN_MODE } from "$env/static/public"
import { getFromCookies } from "$lib/server/account"
import type { Account } from "@prisma/client"
import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  cookies,
  route,
}): Promise<{ account?: Account }> => {
  const account = await getFromCookies(cookies)

  if (PUBLIC_KS_ADMIN_MODE == "true") {
    if (route.id == "/admin/create") {
      return { account: account?.value }
    } else {
      throw redirect(302, "/admin/create")
    }
  } else if (route.id == "/admin/create") {
    throw redirect(302, "/")
  }

  if (!account || !account.ok) {
    if (
      route.id == "/log-in" ||
      route.id == "/log-in/[code]" ||
      route.id == "/sign-up" ||
      route.id == "/sign-up/[id]"
    ) {
      return {}
    }

    cookies.delete("session")

    if (PUBLIC_KS_ADMIN_MODE == "true") {
      throw redirect(302, "/admin/create")
    } else {
      throw redirect(302, "/log-in")
    }
  }

  return { account: account.value }
}
