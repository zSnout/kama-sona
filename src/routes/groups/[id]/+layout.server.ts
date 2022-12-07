import { unwrapOr500 } from "$lib/result"
import * as Group from "$lib/server/group"
import { error, redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ parent, params }) => {
  const { account } = await parent()

  if (!account) {
    throw redirect(302, "/log-in")
  }

  const { id } = params

  const group = unwrapOr500(await Group.get({ id }))

  const isMember = group.memberIds.includes(account.id)
  const isManager = group.managerIds.includes(account.id)

  if (!isMember) {
    throw error(503, "You don't have access to this group.")
  }

  return { account, group, isManager }
}
