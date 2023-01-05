import { unwrapOr500 } from "$lib/result"
import { errorNoAssignmentExists } from "$lib/server/assignment"
import { query, transaction } from "$lib/server/database"
import { extractData } from "$lib/server/extract"
import { error } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions = {
  async comment({ locals: { account }, params: { statusId }, request }) {
    await transaction(async (tx) => {
      const { comment } = await extractData(request, ["comment"] as const)

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
  async exempt({ locals: { account }, params: { statusId } }) {
    await transaction(async (tx) => {
      const { exempt, assignment } = unwrapOr500(
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
          "You must manage an assignment in order to mark it as exempt."
        )
      }

      await query(() =>
        tx.assignmentStatus.update({
          where: { id: statusId },
          data: { exempt: !exempt, missing: false },
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
