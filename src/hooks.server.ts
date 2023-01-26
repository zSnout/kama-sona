import { PUBLIC_KS_ADMIN_MODE } from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { Session } from "$lib/server/session"
import { error, json, redirect, type Handle } from "@sveltejs/kit"

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

  const session = Session.fromCookies(event.cookies)

  if (!session.ok) {
    if (event.url.pathname == "/activity") {
      return json({ type: "NotSignedIn" })
    }

    event.cookies.delete("session", { path: "/" })
    throw redirect(303, "/log-in")
  }

  Object.defineProperty(event.locals, "account", {
    configurable: true,
    value: unwrapOr500(await session.value.account()),
  })

  return await resolve(event)
}
