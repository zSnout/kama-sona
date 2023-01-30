import { unwrapOr500 } from "$lib/result"
import { BulletinList } from "$lib/server/bulletin"
import { json } from "@sveltejs/kit"
import type { BulletinItem } from "../features/Bulletin.svelte"
import type { RequestHandler } from "./$types"

export const GET = (async () => {
  const data = unwrapOr500(
    await new BulletinList({}).select({
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      body: true,
      creation: true,
      id: true,
      title: true,
    })
  )

  return json(data satisfies BulletinItem[])
}) satisfies RequestHandler
