import { unwrapOr500 } from "$lib/result"
import { errorNoAssignmentExists } from "$lib/server/assignment"
import { query, transaction } from "$lib/server/database"
import * as Extract from "$lib/server/extract"
import { error } from "@sveltejs/kit"
import type { Actions } from "./$types"

const scoreExtractor = Extract.fromRequest(Extract.number("score"))

export const actions = {
  async clearScore({ locals: { account }, params: { statusId }, request }) {
    await transaction(async (tx) => {
      const { assignment } = unwrapOr500(
        await query(
          () =>
            tx.assignmentStatus.findUnique({
              where: { id: statusId },
              select: { assignment: true },
            }),
          errorNoAssignmentExists
        )
      )

      if (!assignment.managerIds.includes(account.id)) {
        throw error(503, "You must manage an assignment in order to grade it.")
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: { exempt: false, score: null },
        })
      )
    })
  },
  async comment({ locals: { account }, params: { statusId }, request }) {
    await transaction(async (tx) => {
      const { comment } = await Extract.extractData(request, [
        "comment",
      ] as const)

      const { assignment } = unwrapOr500(
        await query(
          () =>
            tx.assignmentStatus.findUnique({
              where: { id: statusId },
              select: { assignment: true, exempt: true },
            }),
          errorNoAssignmentExists
        )
      )

      if (!assignment.managerIds.includes(account.id)) {
        throw error(
          503,
          "You must manage an assignment in order to add a comment."
        )
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: { teacherComment: comment },
        })
      )
    })
  },
  async score({ locals: { account }, params: { statusId }, request }) {
    await transaction(async (tx) => {
      const { score } = await scoreExtractor(request)

      const { assignment } = unwrapOr500(
        await query(
          () =>
            tx.assignmentStatus.findUnique({
              where: { id: statusId },
              select: { assignment: true },
            }),
          errorNoAssignmentExists
        )
      )

      if (!assignment.managerIds.includes(account.id)) {
        throw error(503, "You must manage an assignment in order to grade it.")
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: { exempt: false, score },
        })
      )
    })
  },
  async exempt({ locals: { account }, params: { statusId } }) {
    await transaction(async (tx) => {
      const { assignment, exempt, score } = unwrapOr500(
        await query(
          () =>
            tx.assignmentStatus.findUnique({
              where: { id: statusId },
              select: { assignment: true, exempt: true, score: true },
            }),
          errorNoAssignmentExists
        )
      )

      if (!assignment.managerIds.includes(account.id)) {
        throw error(
          503,
          "You must manage an assignment in order to mark it as exempt."
        )
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: {
            exempt: !exempt,
            missing: false,
            score: !exempt ? null : score,
          },
        })
      )
    })
  },
  async missing({ locals: { account }, params: { statusId } }) {
    await transaction(async (tx) => {
      const { missing, assignment } = unwrapOr500(
        await query(
          () =>
            tx.assignmentStatus.findUnique({
              where: { id: statusId },
              select: { assignment: true, missing: true },
            }),
          errorNoAssignmentExists
        )
      )

      if (!assignment.managerIds.includes(account.id)) {
        throw error(
          503,
          "You must manage an assignment in order to mark it as missing."
        )
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: { exempt: false, missing: !missing },
        })
      )
    })
  },
} satisfies Actions
