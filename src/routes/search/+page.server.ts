import { unwrapOr500 } from "$lib/result"
import * as Assignment from "$lib/server/assignment"
import * as AssignmentStatus from "$lib/server/assignment-status"
import * as Group from "$lib/server/group"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  return {
    account,
    assignedAssignments: AssignmentStatus.getAllWithAssignee({
      id: account.id,
    }).then(unwrapOr500),
    managedAssignments: Assignment.getAllWithManager({
      id: account.id,
    }).then(unwrapOr500),
    groups: Group.getAllWithMember({ id: account.id }).then(unwrapOr500),
  }
}) satisfies PageServerLoad
