import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/extract"
import { Group } from "$lib/server/group"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async default({ locals: { account }, request }) {
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

    const { id } = unwrapOr500(await group.select({ id: true }))

    throw redirect(302, `/group/${id}`)
  },
} satisfies Actions
