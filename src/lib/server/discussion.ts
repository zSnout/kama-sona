import { error, isUnwrap500Error, unwrapOr500, type Result } from "$lib/result"
import { AttachmentType, type Discussion, type Prisma } from "@prisma/client"
import sanitize from "sanitize-html"
import * as Account from "./account"
import { query } from "./database"
import * as Group from "./group"
import { upload } from "./upload"

export interface DiscussionCreateOptions {
  readonly category:
    | { readonly name: string; readonly weight: number }
    | { readonly id: string }
  readonly description: string
  readonly files: readonly File[]
  readonly groups: readonly {
    readonly id: string
  }[]
  readonly links: readonly {
    readonly href: string
    readonly title: string
  }[]
  readonly title: string
  readonly viewableAfter: Date
}

/** Creates a discussion. */
export async function create(
  data: DiscussionCreateOptions
): Promise<Result<Discussion>> {
  const description = sanitize(data.description)

  try {
    // I know that using `var` is like a stab in the back by a friend you trust
    // most, but I'd rather use it than have a separate `let` and discussion,
    // even though it would be completely valid according to TSC.

    var attachments: Prisma.AttachmentCreateInput[] = await Promise.all(
      data.files.map(async (file) => ({
        type: AttachmentType.File,
        content: unwrapOr500(await upload(file)).id,
        label: file.name,
      }))
    )
  } catch (err) {
    if (isUnwrap500Error(err)) {
      return err.body.result
    } else {
      throw err
    }
  }

  data.links.forEach(({ href, title }) => {
    attachments.push({
      type: AttachmentType.Link,
      content: href,
      label: title,
    })
  })

  const groupIds = data.groups.map((group) => group.id)
  const groupFilters = groupIds.map((id) => ({ id }))

  const groupMemberResult = await Group.getGroupMembers(groupIds)

  if (!groupMemberResult.ok) {
    return groupMemberResult
  }

  const {
    managersOf: { all: managers },
    members: commenters,
  } = groupMemberResult.value

  return await rawCreate({
    attachments,
    category: {
      connect:
        "id" in data.category
          ? {
              id: data.category.id,
            }
          : undefined,
      create:
        "id" in data.category
          ? undefined
          : {
              title: data.category.name,
              weight: data.category.weight,
              groups: { connect: groupFilters },
            },
    },
    description,
    groups: { connect: groupFilters },
    isTopLevel: true,
    managers: managers.length
      ? { connect: managers.map((id) => ({ id })) }
      : undefined,
    title: data.title.slice(0, 100),
    viewableAfter: data.viewableAfter,
    commenters: commenters.length
      ? { connect: commenters.map((id) => ({ id })) }
      : undefined,
  })
}

/** Creates a discussion from raw database information. */
export async function rawCreate(data: Prisma.DiscussionCreateInput) {
  return await query((database) => database.discussion.create({ data }))
}

export const errorNoDiscussionExists = error(
  "No discussion exists that matches the given information."
)

/** Gets a specific discussion. */
export async function get(discussion: Prisma.DiscussionWhereUniqueInput) {
  return await query(
    (database) =>
      database.discussion.findUnique({
        where: discussion,
        include: {
          category: true,
          content: true,
          groups: true,
        },
      }),
    errorNoDiscussionExists
  )
}

/** Gets all discussions that have a specific manager. */
export async function getAllWithMember(
  manager: Prisma.AccountWhereUniqueInput
) {
  return await query(
    (database) =>
      database.account.findUnique({ where: manager }).commentableDiscussions({
        orderBy: { title: "asc" },
        include: { category: true, groups: true },
      }),
    Account.errorNoAccountExists
  )
}
