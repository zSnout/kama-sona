import { unwrapOr500 } from "$lib/result"
import * as Assignment from "$lib/server/assignment"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ parent }) => {
  const { account } = await parent()

  if (!account) {
    throw redirect(302, "/log-in")
  }

  unwrapOr500(
    await Assignment.setDefaultAssignmentView({ id: account.id }, "Teacher")
  )

  return {
    assignments: unwrapOr500(
      await Assignment.getAllWithAssignee({ id: account.id })
    ),
  }
}
