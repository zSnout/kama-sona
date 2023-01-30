import { unwrapOr500 } from "$lib/result"
import { Bulletin } from "$lib/server/bulletin"
import { extractData } from "$lib/server/extract"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  const isAllowed = unwrapOr500(
    await account.permissions().has("create:bulletin")
  )

  if (!isAllowed) {
    throw error(503, "You don't have permission to create bulletins.")
  }
}) satisfies PageServerLoad

export const actions = {
  async default({ locals: { account }, request }) {
    if (!unwrapOr500(await account.permissions().has("create:bulletin"))) {
      throw error(503, "You don't have permission to create bulletins.")
    }

    const { body, title } = await extractData(request, [
      "body",
      "title",
    ] as const)

    unwrapOr500(
      await Bulletin.create({
        author: { connect: account.filter },
        body: body.trim().slice(0, 10000),
        title: title.trim().slice(0, 32),
      })
    )

    throw redirect(302, "/")
  },
} satisfies Actions
