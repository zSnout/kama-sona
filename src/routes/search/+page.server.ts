import { unwrapOr500 } from "$lib/result"
import { AssignmentList } from "$lib/server/assignment"
import { AssignmentStatusList } from "$lib/server/assignment-status"
import { GroupList } from "$lib/server/group"
import { ResourceList } from "$lib/server/resource"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  const myId = unwrapOr500(await account.id())

  return {
    account: account
      .select({
        id: true,
        memberOfIds: true,
      })
      .then(unwrapOr500),

    assignedAssignments: new AssignmentStatusList({ assigneeId: myId })
      .select({
        assignment: {
          select: {
            category: {
              select: { title: true },
            },
            due: true,
            groups: {
              select: {
                id: true,
                title: true,
              },
              orderBy: { title: "asc" },
            },
            points: true,
            title: true,
            viewableAfter: true,
          },
        },
        due: true,
        id: true,
      })
      .then(unwrapOr500),

    managedAssignments: new AssignmentList({ managerIds: { has: myId } })
      .select({
        category: {
          select: { title: true },
        },
        creation: true,
        due: true,
        groups: {
          select: {
            id: true,
            title: true,
          },
          orderBy: { title: "asc" },
        },
        id: true,
        title: true,
        viewableAfter: true,
        points: true,
      })
      .then(unwrapOr500),

    resources: new ResourceList({ viewerIds: { has: myId } })
      .select({
        category: {
          select: { title: true },
        },
        creation: true,
        groups: {
          select: {
            id: true,
            title: true,
          },
          orderBy: { title: "asc" },
        },
        id: true,
        managerIds: true,
        title: true,
        viewableAfter: true,
      })
      .then(unwrapOr500),

    groups: new GroupList({ memberIds: { has: myId } })
      .select({
        id: true,
        managerIds: true,
        memberIds: true,
        title: true,
      })
      .then(unwrapOr500),
  }
}) satisfies PageServerLoad
