import { unwrapOr500 } from "$lib/result"
import { Resource } from "$lib/server/resource"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account }, params }) => {
  const myId = unwrapOr500(await account.id())

  const resource = new Resource({ id: params.id })

  const data = unwrapOr500(
    await resource.select({
      attachments: true,
      description: true,
      groups: {
        select: {
          id: true,
          title: true,
        },
        orderBy: { title: "asc" },
        where: {
          memberIds: { has: myId },
        },
      },
      title: true,
      viewerIds: true,
    })
  )

  if (!data.viewerIds.includes(myId)) {
    throw error(503, "Sorry, you can't see somebody else's resource.")
  }

  return { resource: data }
}) satisfies PageServerLoad
