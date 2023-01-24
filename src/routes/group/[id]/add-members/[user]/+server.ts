import { unwrapOr500 } from "$lib/result"
import { Group } from "$lib/server/group"
import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const POST = (async ({ locals: { account }, params: { id, user } }) => {
  const group = new Group({ id })

  const data = unwrapOr500(
    await group.select({ managerIds: true, title: true })
  )

  const myId = unwrapOr500(await account.id())

  const isManager = data.managerIds.includes(myId)

  if (!isManager) {
    throw error(
      503,
      `Trying to sneak your friend into ${data.title}? Well, you'll have to become a manager first.`
    )
  }

  unwrapOr500(
    await group.update({
      members: {
        connect: { id: user },
      },
    })
  )

  throw redirect(302, `/group/${id}/add-members`)
}) satisfies RequestHandler
