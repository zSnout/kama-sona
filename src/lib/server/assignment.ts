import { ok, type Result } from "$lib/result"
import type {
  Assignment,
  AssignmentStatus,
  AssignmentView,
  Prisma,
} from "@prisma/client"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

/** Gets all assignments that have a specific assignee. */
export async function getAllWithAssignee(
  assignee: Prisma.AccountWhereUniqueInput
): Promise<Result<readonly (AssignmentStatus & { assignment: Assignment })[]>> {
  return await query(
    (database) =>
      database.account
        .findUnique({ where: assignee })
        .assignedTo({ include: { assignment: true } }),
    errorNoAccountExists
  )
}

/** Gets all assignments that have a specific manager. */
export async function getAllWithManager(
  manager: Prisma.AccountWhereUniqueInput
): Promise<Result<readonly Assignment[]>> {
  return await query(
    (database) =>
      database.account.findUnique({ where: manager }).managedAssignments(),
    errorNoAccountExists
  )
}

/** Sets the default assignment view for an account. */
export async function setDefaultAssignmentView(
  account: Prisma.AccountWhereUniqueInput,
  view: AssignmentView
): Promise<Result<void>> {
  const result = await query(
    (database) =>
      database.account.update({
        where: account,
        data: { defaultAssignmentView: view },
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok()
}
