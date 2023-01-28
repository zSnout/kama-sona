import { unwrapOr500 } from "$lib/result"
import { Passkey } from "$lib/server/passkey"
import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ locals: { account }, params: { id } }) => {
  const passkey = new Passkey({ id })

  const { accountId: passkeyAccountId } = unwrapOr500(
    await passkey.select({
      accountId: true,
    })
  )

  const myAccountId = unwrapOr500(await account.id())

  if (passkeyAccountId != myAccountId) {
    throw error(
      400,
      "Are you trying to delete somebody else's passkey? Shame on you."
    )
  }

  await passkey.delete()

  throw redirect(303, "/settings")
}) satisfies RequestHandler
