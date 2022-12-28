import { PUBLIC_KS_ADMIN_MODE } from "$env/static/public"
import * as Account from "$lib/server/account"
import { error, redirect, type Handle } from "@sveltejs/kit"

function throwOnAccess(): never {
  throw error(
    500,
    `A log in or sign up page tried to access 'locals.account'. Report this as a bug IMMEDIATELY.`
  )
}

export const handle: Handle = async ({ event, resolve }) => {
  if (PUBLIC_KS_ADMIN_MODE == "true") {
    if (event.url.pathname != "/admin/create") {
      throw redirect(303, "/admin/create")
    }
  }

  Object.defineProperty(event.locals, "account", {
    configurable: true,
    get: throwOnAccess,
  })

  if (
    event.url.pathname.startsWith("/log-in") ||
    event.url.pathname.startsWith("/sign-up")
  ) {
    return await resolve(event)
  }

  const account = await Account.getFromCookies(event.cookies)

  if (!account.ok) {
    event.cookies.delete("session", { path: "/" })
    throw redirect(303, "/log-in")
  }

  Object.defineProperty(event.locals, "account", {
    configurable: true,
    value: account.value,
  })

  return await resolve(event)
}
