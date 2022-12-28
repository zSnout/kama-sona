import type { PageServerLoad } from "./$types"

export const load = (({ locals: { account } }) => {
  return { account }
}) satisfies PageServerLoad
