import { unwrapOr500 } from "$lib/result"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  return account
    .select({
      name: true,
      passkeys: {
        select: {
          id: true,
          label: true,
        },
        orderBy: { creation: "desc" },
      },
    })
    .then(unwrapOr500)
}) satisfies PageServerLoad
