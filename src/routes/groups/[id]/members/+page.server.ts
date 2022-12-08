import { unwrapOr500 } from "$lib/result"
import * as Group from "$lib/server/group"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
  return {
    group: unwrapOr500(
      await Group.getWithMembers({
        id: params.id,
      })
    ),
  }
}
