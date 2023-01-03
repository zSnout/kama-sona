import { unwrapOr500 } from "$lib/result"
import * as Assignment from "$lib/server/assignment"
import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params: { id } }) => {
  const assignment = unwrapOr500(await Assignment.get({ id }))

  if (!assignment.managerIds.includes(account.id)) {
    throw error(503, "I don't think you teach this assignment.")
  }

  return { assignment }
}) satisfies LayoutServerLoad
