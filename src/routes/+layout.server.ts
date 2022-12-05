import { PUBLIC_KS_ADMIN_MODE } from "$env/static/public"
import { get } from "$lib/server/account"
import type { Account } from "@prisma/client"
import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  cookies,
  route,
}): Promise<{ account?: Account }> => {
  const session = cookies.get("session")
  const account = session ? await get({ session }) : undefined

  if (PUBLIC_KS_ADMIN_MODE == "true") {
    if (route.id == "/admin/create") {
      return { account: account?.value }
    } else {
      throw redirect(302, "/admin/create")
    }
  }

  if (!account || !account.ok) {
    if (
      PUBLIC_KS_ADMIN_MODE == "true"
        ? route.id == "/admin/create"
        : route.id == "/log-in" || route.id == "/log-in/[code]"
    ) {
      return {}
    }

    cookies.delete("ks_session")

    if (PUBLIC_KS_ADMIN_MODE == "true") {
      throw redirect(302, "/admin/create")
    } else {
      throw redirect(302, "/log-in")
    }
  }

  return { account: account.value }
}
