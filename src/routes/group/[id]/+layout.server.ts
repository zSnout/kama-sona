import { unwrapOr500 } from "$lib/result"
import { Group } from "$lib/server/group"
import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params: { id } }) => {
  const group = new Group({ id })

  const data = unwrapOr500(
    await group.select({
      id: true,
      managerIds: true,
      managers: {
        select: {
          id: true,
          email: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
      memberIds: true,
      members: {
        select: {
          id: true,
          email: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
      title: true,
    })
  )

  const myId = unwrapOr500(await account.id())

  const isManager = data.managerIds.includes(myId)
  const isMember = data.memberIds.includes(myId)

  if (!isMember) {
    throw error(503, "You don't have access to this group.")
  }

  return { account, group: data, isManager }
}) satisfies LayoutServerLoad
