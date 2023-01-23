import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load = (async ({ params: { id }, parent }) => {
  const data = await parent()
  const group = data.groups.find((group) => group.id == id)

  if (!group) {
    throw error(404, "You're not a member of " + id + ".")
  }

  return { group }
}) satisfies PageLoad
