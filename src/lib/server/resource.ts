import { error, isUnwrap500Error, unwrapOr500, type Result } from "$lib/result"
import { AttachmentType, type Prisma, type Resource } from "@prisma/client"
import sanitize from "sanitize-html"
import * as Account from "./account"
import { query } from "./database"
import * as Group from "./group"
import { upload } from "./upload"

export interface ResourceCreateOptions {
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

/** Creates a resource. */
export async function create(
  data: ResourceCreateOptions
): Promise<Result<Resource>> {
  const description = sanitize(data.description)

  try {
    // I know that using `var` is like a stab in the back by a friend you trust
    // most, but I'd rather use it than have a separate `let` and resource,
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
    members: viewers,
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
    managers: managers.length
      ? { connect: managers.map((id) => ({ id })) }
      : undefined,
    title: data.title.slice(0, 100),
    viewableAfter: data.viewableAfter,
    viewers: viewers.length
      ? { connect: viewers.map((id) => ({ id })) }
      : undefined,
  })
}

/** Creates a resource from raw database information. */
export async function rawCreate(data: Prisma.ResourceCreateInput) {
  return await query((database) => database.resource.create({ data }))
}

export const errorNoResourceExists = error(
  "No resource exists that matches the given information."
)

/** Gets a specific resource. */
export async function get(resource: Prisma.ResourceWhereUniqueInput) {
  return await query(
    (database) =>
      database.resource.findUnique({
        where: resource,
        include: {
          category: true,
          groups: true,
        },
      }),
    errorNoResourceExists
  )
}

/** Gets all resources that have a specific manager. */
export async function getAllWithMember(
  manager: Prisma.AccountWhereUniqueInput
) {
  return await query(
    (database) =>
      database.account.findUnique({ where: manager }).viewedResources({
        orderBy: { title: "asc" },
        include: { category: true, groups: true },
      }),
    Account.errorNoAccountExists
  )
}
