import { unwrapOr500 } from "$lib/result"
import { create } from "$lib/server/assignment"
import * as Category from "$lib/server/category"
import * as Extract from "$lib/server/extract"
import { sanitize } from "$lib/server/sanitize"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  return {
    groups: unwrapOr500(
      await Category.getAllForGroupWithManager({ id: account.id })
    ),
  }
}) satisfies PageServerLoad

const extractor = Extract.fromRequest(
  Extract.combine(
    Extract.text("description"),
    Extract.date("due"),
    Extract.files("files"),
    Extract.multiText("groups"),
    Extract.optional("links", Extract.text),
    Extract.number("points"),
    Extract.text("title"),
    Extract.date("viewableAfter"),
    Extract.optional("newCategoryName", Extract.text),
    Extract.optional("newCategoryWeight", Extract.number),
    Extract.optional("category", Extract.text),
    Extract.boolean("willCreateCategory")
  )
)

export const actions = {
  async default({ locals: { account }, request }) {
    const data = await extractor(request)

    // A user should only be able to create an assignment if they are a manager
    // of all the groups they want to create the assignment in.

    for (const groupId of data.groups) {
      if (!account.managerOfIds.includes(groupId)) {
        throw error(
          503,
          `You cannot publish an assignment in a group that you don't own. Group id: ${groupId}. Your groups: ${account.managerOfIds.join(
            ", "
          )}`
        )
      }
    }

    if (!data.willCreateCategory) {
      unwrapOr500(
        await Category.linkToGroups(
          { id: data.category },
          data.groups.map((id) => ({ id }))
        )
      )
    }

    if (data.willCreateCategory) {
      if (!data.newCategoryName) {
        throw error(
          400,
          "If 'willCreateCategory' is true, 'newCategoryName' must be passed."
        )
      }

      if (data.newCategoryWeight == null) {
        throw error(
          400,
          "If 'willCreateCategory' is true, 'newCategoryWeight' must be passed."
        )
      }
    } else {
      if (!data.category) {
        throw error(
          400,
          "If 'willCreateCategory' is false, 'category' must be passed."
        )
      }
    }

    const assignment = unwrapOr500(
      await create({
        category: data.willCreateCategory
          ? {
              name: data.newCategoryName!.trim().slice(0, 32),
              weight: Math.max(Math.min(data.newCategoryWeight!, 1000), 0),
            }
          : { id: data.category! },
        description: sanitize(data.description),
        due: data.due,
        files: data.files,
        groups: data.groups.map((id) => ({ id })),
        links:
          data.links
            ?.split("\n")
            .map((link) => {
              const [href, title] = link.split("\t")

              if (!href || !title) {
                return false as const
              }

              return { href, title }
            })
            .filter((link): link is typeof link & object => !!link) || [],
        points: Math.max(Math.min(data.points, 1000), 0),
        title: data.title.trim().slice(0, 100),
        viewableAfter: data.viewableAfter,
      })
    )

    throw redirect(302, `/assignment/manage/${assignment.id}`)
  },
} satisfies Actions
