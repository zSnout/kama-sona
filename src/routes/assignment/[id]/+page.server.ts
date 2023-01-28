import { unwrapOr500 } from "$lib/result"
import { AssignmentStatus } from "$lib/server/assignment-status"
import * as Extract from "$lib/server/extract"
import { sanitize } from "$lib/server/sanitize"
import { error } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const myId = unwrapOr500(await account.id())

  const status = unwrapOr500(
    await new AssignmentStatus({ id: params.id }).select({
      assigneeId: true,
      assignment: {
        select: {
          attachments: true,
          description: true,
          groups: {
            select: {
              id: true,
              title: true,
            },
            where: { memberIds: { has: myId } },
          },
          points: true,
          title: true,
        },
      },
      attachments: true,
      body: true,
      due: true,
      exempt: true,
      missing: true,
      score: true,
      submitted: true,
      teacherComment: true,
    })
  )

  if (status.assigneeId != myId) {
    throw error(
      503,
      "It looks like you're trying to see someone else's assignment! Well, okay. I uploaded their data at zsnout.com/?rr, just for you."
    )
  }

  return { status }
}) satisfies PageServerLoad

const descriptionExtractor = Extract.fromRequest(
  Extract.optional("body", Extract.text)
)

export const actions = {
  async draft({ locals: { account }, params, request }) {
    const myId = unwrapOr500(await account.id())

    const status = new AssignmentStatus({ id: params.id })

    const data = unwrapOr500(
      await status.select({
        assigneeId: true,
        submitted: true,
      })
    )

    if (data.assigneeId != myId) {
      throw error(
        503,
        "Are you trying to change the contents of someone else's assignment? Shame."
      )
    }

    if (data.submitted) {
      throw error(409, "You can't change an assignment after it's submitted!")
    }

    const { body } = await descriptionExtractor(request)

    unwrapOr500(await status.update({ body: sanitize(body || "") }))
  },
  async submit({ locals: { account }, params, request }) {
    const myId = unwrapOr500(await account.id())

    const status = new AssignmentStatus({ id: params.id })

    const data = unwrapOr500(
      await status.select({
        assigneeId: true,
        submitted: true,
      })
    )

    if (data.assigneeId != myId) {
      throw error(
        503,
        "Are you trying to change the contents of someone else's assignment? Shame."
      )
    }

    if (data.submitted) {
      throw error(409, "You can't change an assignment after it's submitted!")
    }

    const { body } = await descriptionExtractor(request)

    unwrapOr500(
      await status.update({
        body: sanitize(body || ""),
        submitted: new Date(),
      })
    )
  },
  async unsubmit({ locals: { account }, params }) {
    const myId = unwrapOr500(await account.id())

    const status = new AssignmentStatus({ id: params.id })

    const data = unwrapOr500(
      await status.select({
        assigneeId: true,
        submitted: true,
      })
    )

    if (data.assigneeId != myId) {
      throw error(
        503,
        "Why are you trying to unsubmit someone else's assignment?"
      )
    }

    if (!data.submitted) {
      throw error(
        409,
        "I don't think I can unsubmit an assignment that isn't submitted yet."
      )
    }

    unwrapOr500(await status.update({ submitted: null }))
  },
} satisfies Actions
