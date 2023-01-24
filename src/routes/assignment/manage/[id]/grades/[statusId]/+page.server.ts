import { unwrapOr500 } from "$lib/result"
import { AssignmentStatus } from "$lib/server/assignment-status"
import * as Extract from "$lib/server/extract"
import { error } from "@sveltejs/kit"
import type { Actions } from "./$types"

const scoreExtractor = Extract.fromRequest(Extract.number("score"))

export const actions = {
  async clearScore({ locals: { account }, params: { statusId } }) {
    const status = new AssignmentStatus({ id: statusId })

    const { assignment } = unwrapOr500(
      await status.select({
        assignment: {
          select: {
            managerIds: true,
          },
        },
      })
    )

    const myId = unwrapOr500(await account.id())

    if (!assignment.managerIds.includes(myId)) {
      throw error(503, "You must manage an assignment in order to grade it.")
    }

    unwrapOr500(await status.update({ exempt: false, score: null }))
  },
  async comment({ locals: { account }, params: { statusId }, request }) {
    const { comment } = await Extract.extractData(request, ["comment"] as const)

    const status = new AssignmentStatus({ id: statusId })

    const { assignment } = unwrapOr500(
      await status.select({
        assignment: {
          select: {
            managerIds: true,
          },
        },
      })
    )

    const myId = unwrapOr500(await account.id())

    if (!assignment.managerIds.includes(myId)) {
      throw error(
        503,
        "You must manage an assignment in order to add a comment to it."
      )
    }

    unwrapOr500(await status.update({ teacherComment: comment }))
  },
  async score({ locals: { account }, params: { statusId }, request }) {
    const { score } = await scoreExtractor(request)

    const status = new AssignmentStatus({ id: statusId })

    const { assignment } = unwrapOr500(
      await status.select({
        assignment: {
          select: {
            managerIds: true,
          },
        },
      })
    )

    const myId = unwrapOr500(await account.id())

    if (!assignment.managerIds.includes(myId)) {
      throw error(503, "You must manage an assignment in order to grade it.")
    }

    unwrapOr500(await status.update({ exempt: false, score }))
  },
  async exempt({ locals: { account }, params: { statusId } }) {
    const status = new AssignmentStatus({ id: statusId })

    const { assignment, exempt } = unwrapOr500(
      await status.select({
        assignment: {
          select: {
            managerIds: true,
          },
        },
        exempt: true,
      })
    )

    const myId = unwrapOr500(await account.id())

    if (!assignment.managerIds.includes(myId)) {
      throw error(
        503,
        "You must manage an assignment in order to mark it as exempt."
      )
    }

    unwrapOr500(
      await status.update({
        exempt: !exempt,
        missing: false,
        score: null,
      })
    )
  },
  async missing({ locals: { account }, params: { statusId } }) {
    const status = new AssignmentStatus({ id: statusId })

    const { assignment, missing } = unwrapOr500(
      await status.select({
        assignment: {
          select: {
            managerIds: true,
          },
        },
        missing: true,
      })
    )

    const myId = unwrapOr500(await account.id())

    if (!assignment.managerIds.includes(myId)) {
      throw error(
        503,
        "You must manage an assignment in order to mark it as missing."
      )
    }

    unwrapOr500(
      await status.update({
        exempt: false,
        missing: !missing,
      })
    )
  },
} satisfies Actions
