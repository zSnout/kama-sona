import { unwrapOr500 } from "$lib/result"
import * as Group from "$lib/server/group"
import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const POST = (async ({ locals: { account }, params: { id, user } }) => {
  const group = unwrapOr500(await Group.getWithMembers({ id }))

  const isManager = group.managerIds.includes(account.id)

  if (!isManager) {
    throw error(
      503,
      `Trying to sneak your friend into ${group.title}? Well, you'll have to become a manager first.`
    )
  }

  unwrapOr500(
    await Group.update({ id: id }, { members: { connect: { id: user } } })
  )

  throw redirect(302, `/group/${id}/add-members`)
}) satisfies RequestHandler
