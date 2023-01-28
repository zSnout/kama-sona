import { PUBLIC_KS_MAX_UPLOAD_SIZE } from "$env/static/public"
import { unwrapOr500 } from "$lib/result"
import { Category } from "$lib/server/category"
import * as Extract from "$lib/server/extract"
import { Resource } from "$lib/server/resource"
import { sanitize } from "$lib/server/sanitize"
import { error, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  const isAllowed = unwrapOr500(
    await account.permissions().has("create:resource")
  )

  if (!isAllowed) {
    throw error(503, "You don't have permission to create resources.")
  }

  const managedGroups = account.managedGroups()

  return {
    groups: managedGroups
      .select({
        id: true,
        title: true,
        categories: {
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            title: "asc",
          },
        },
      })
      .then(unwrapOr500),
  }
}) satisfies PageServerLoad

const extractor = Extract.fromRequest(
  Extract.combine(
    Extract.text("description"),
    Extract.files("files"),
    Extract.multiText("groups"),
    Extract.optional("links", Extract.text),
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
    if (!unwrapOr500(await account.permissions().has("create:resource"))) {
      throw error(503, "You don't have permission to create resources.")
    }

    const data = await extractor(request)

    const maxSize = Number.isSafeInteger(+PUBLIC_KS_MAX_UPLOAD_SIZE)
      ? Math.max(+PUBLIC_KS_MAX_UPLOAD_SIZE, 0)
      : 0

    if (data.files.reduce((a, b) => a + b.size, 0) > maxSize) {
      throw error(400, "Your files are too large.")
    }

    const accountData = unwrapOr500(
      await account.select({ managerOfIds: true })
    )

    // A user should only be able to create a resource if they are a manager
    // of all the groups they want to create the resource in.

    for (const groupId of data.groups) {
      if (!accountData.managerOfIds.includes(groupId)) {
        throw error(
          503,
          "You cannot publish a resource in a group that you don't own."
        )
      }
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

      unwrapOr500(
        await new Category({ id: data.category }).update({
          groups: { connect: data.groups.map((id) => ({ id })) },
        })
      )
    }

    const resource = unwrapOr500(
      await Resource.create({
        category: data.willCreateCategory
          ? {
              name: data.newCategoryName!.trim().slice(0, 32),
              weight: Math.max(Math.min(data.newCategoryWeight!, 1000), 0),
            }
          : { id: data.category! },
        description: sanitize(data.description),
        files: data.files,
        groupIds: data.groups,
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
        title: data.title.trim().slice(0, 100),
        viewableAfter: data.viewableAfter,
      })
    )

    throw redirect(302, `/resource/${unwrapOr500(await resource.id())}`)
  },
} satisfies Actions
