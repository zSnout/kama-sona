import { unwrapOr500 } from "$lib/result"
import * as CardDeck from "$lib/server/card-deck"
import { extractData } from "$lib/server/extract"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async default({ locals: { account }, request }) {
    const { title } = await extractData(request, ["title"] as const)

    const { id } = unwrapOr500(
      await CardDeck.create({
        title: title.trim().slice(0, 32),
        manager: { connect: { id: account.id } },
      })
    )

    throw redirect(302, `/card-deck/${id}`)
  },
} satisfies Actions
