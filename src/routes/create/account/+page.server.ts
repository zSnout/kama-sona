import { unwrapOr500 } from "$lib/result"
import { Account, permissions } from "$lib/server/account"
import * as Extract from "$lib/server/extract"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  if (!unwrapOr500(await account.permissions().has("create:account"))) {
    throw error(503, "You don't have permission to create accounts.")
  }

  return { permissions }
}) satisfies PageServerLoad

const extractor = Extract.fromRequest(
  Extract.combine(
    Extract.text("email"),
    Extract.text("name"),
    Extract.optional("permission", Extract.multiText)
  )
)

export const actions = {
  async default({ locals: { account }, request }) {
    if (!unwrapOr500(await account.permissions().has("create:account"))) {
      throw error(503, "You don't have permission to create accounts.")
    }

    const { email, name, permission } = await extractor(request)
    const permissions: string[] = permission ? permission : []

    const newAccount = unwrapOr500(
      await Account.create({
        name: name.trim().slice(0, 32),
        email,
        permissions,
      })
    )

    const { id } = unwrapOr500(await newAccount.select({ id: true }))

    throw redirect(302, `/directory/${id}`)
  },
} satisfies Actions
