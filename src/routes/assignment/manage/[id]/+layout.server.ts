import { unwrapOr500 } from "$lib/result"
import { Assignment } from "$lib/server/assignment"
import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params: { id } }) => {
  const assignment = unwrapOr500(
    await new Assignment({ id }).select({
      attachments: true,
      description: true,
      due: true,
      groups: {
        select: {
          id: true,
          title: true,
        },
      },
      id: true,
      managerIds: true,
      points: true,
      statuses: {
        select: {
          assignee: {
            select: {
              id: true,
              name: true,
            },
          },
          attachments: true,
          body: true,
          due: true,
          exempt: true,
          id: true,
          missing: true,
          score: true,
          submitted: true,
          teacherComment: true,
        },
        orderBy: { assignee: { name: "asc" } },
      },
      title: true,
    })
  )

  const myId = unwrapOr500(await account.id())

  if (!assignment.managerIds.includes(myId)) {
    throw error(503, "I don't think you teach this assignment.")
  }

  return { assignment }
}) satisfies LayoutServerLoad
