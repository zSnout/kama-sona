import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import * as Group from "$lib/server/group"
import { unwrapOr500 } from "$lib/result"

export const load: PageServerLoad = async ({ parent, params }) => {
  const { isManager } = await parent()

  if (!isManager) {
    throw error(503, "You must be a group manager to add members.")
  }

  unwrapOr500(
    await Group.update(
      { id: params.id },
      { members: { connect: { id: params.user } } }
    )
  )

  throw redirect(302, `/groups/${params.id}/members/add`)
}
