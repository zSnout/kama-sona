import { unwrapOr500 } from "$lib/result"
import * as Group from "$lib/server/group"
import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const { id } = params

  const group = unwrapOr500(await Group.get({ id }))

  const isMember = group.memberIds.includes(account.id)
  const isManager = group.managerIds.includes(account.id)

  if (!isMember) {
    throw error(503, "You don't have access to this group.")
  }

  return { account, group, isManager }
}) satisfies LayoutServerLoad
