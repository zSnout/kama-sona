import { ok } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { errorNoAccountExists } from "./account"
import { errorNoAssignmentExists } from "./assignment"
import { query, transaction } from "./database"

/** Gets a specific assignment status. */
export async function get(assignment: Prisma.AssignmentStatusWhereUniqueInput) {
  return await transaction(async (tx, check) => {
    const status = check(
      await tx.assignmentStatus.findUnique({
        where: assignment,
        include: { assignee: true },
      })
    )

    return tx.assignmentStatus.findUnique({
      where: { id: status.id },
      include: {
        assignment: {
          include: {
            groups: {
              where: {
                id: { in: status.assignee.memberOfIds },
              },
            },
          },
        },
      },
    })
  }, errorNoAssignmentExists)
}

/** Gets all assignment statuses with a specific assignee. */
export async function getAllWithAssignee(
  assignee: Prisma.AccountWhereUniqueInput
) {
  const result = await query(
    (database) =>
      database.account.findUnique({ where: assignee }).assignedTo({
        include: {
          assignment: {
            include: { category: true, groups: true },
          },
        },
        orderBy: { assignment: { title: "asc" } },
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok(
    result.value.filter(
      (result) => result.assignment.viewableAfter < new Date()
    )
  )
}
