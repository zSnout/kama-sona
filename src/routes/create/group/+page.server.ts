import { unwrapOr500 } from "$lib/result"
import { extractData } from "$lib/server/extract"
import * as Group from "$lib/server/group"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async default({ locals: { account }, request }) {
    const { title } = await extractData(request, ["title"] as const)

    const { id } = unwrapOr500(
      await Group.create({
        group: { title },
        manager: { id: account.id },
      })
    )

    throw redirect(302, `/group/${id}`)
  },
} satisfies Actions
