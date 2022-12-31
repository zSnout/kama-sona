import { unwrapOr500 } from "$lib/result"
import { sanitize } from "$lib/sanitize"
import * as AssignmentStatus from "$lib/server/assignment-status"
import { extractData } from "$lib/server/extract"
import { error } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const status = unwrapOr500(await AssignmentStatus.get({ id: params.id }))

  if (status.assigneeId != account.id) {
    throw error(
      503,
      "It looks like you're trying to see someone else's assignment! Well, okay. I uploaded their data at zsnout.com/?rr, just for you."
    )
  }

  return { status }
}) satisfies PageServerLoad

export const actions = {
  async draft({ locals: { account }, params, request }) {
    const status = unwrapOr500(await AssignmentStatus.get({ id: params.id }))

    if (status.assigneeId != account.id) {
      throw error(
        503,
        "Are you trying to change the contents of someone else's assignment? Shame."
      )
    }

    if (status.submitted) {
      throw error(409, "You can't change an assignment after it's submitted!")
    }

    const { description } = await extractData(request, ["description"] as const)

    unwrapOr500(
      await AssignmentStatus.update(
        { id: params.id },
        { body: sanitize(description) }
      )
    )
  },
  async submit({ locals: { account }, params, request }) {
    const status = unwrapOr500(await AssignmentStatus.get({ id: params.id }))

    if (status.assigneeId != account.id) {
      throw error(
        503,
        "Are you trying to change the contents of someone else's assignment? Shame."
      )
    }

    if (status.submitted) {
      throw error(409, "You can't change an assignment after it's submitted!")
    }

    const { description } = await extractData(request, ["description"] as const)

    unwrapOr500(
      await AssignmentStatus.update(
        { id: params.id },
        { body: sanitize(description), submitted: new Date() }
      )
    )
  },
} satisfies Actions
