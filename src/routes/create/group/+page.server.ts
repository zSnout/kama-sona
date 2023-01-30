import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/extract"
import { Group } from "$lib/server/group"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  const isAllowed = unwrapOr500(await account.permissions().has("create:group"))

  if (!isAllowed) {
    throw error(503, "You don't have permission to create groups.")
  }
}) satisfies PageServerLoad

export const actions = {
  async default({ locals: { account }, request }) {
    if (!unwrapOr500(await account.permissions().has("create:group"))) {
      throw error(503, "You don't have permission to create groups.")
    }

    const { title } = await extractData(request, ["title"] as const)

    const group = unwrapOr500(
      await Group.create({
        title: title.trim().slice(0, 32),
        managers: {
          connect: {
            id: unwrapOr500(await account.id()),
          },
        },
      })
    )

    const id = unwrapOr500(await group.id())

    throw redirect(302, `/group/${id}`)
  },
} satisfies Actions
