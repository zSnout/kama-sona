import { error, isUnwrap500Error, unwrapOr500, type Result } from "$lib/result"
import { AttachmentType, type Assignment, type Prisma } from "@prisma/client"
import sanitize from "sanitize-html"
import * as Account from "./account"
import { query } from "./database"
import { getGroupMembers } from "./group"
import { upload } from "./upload"

export interface AssignmentCreateOptions {
  readonly category:
    | { readonly name: string; readonly weight: number }
    | { readonly id: string }
  readonly description: string
  readonly due: Date
  readonly files: readonly File[]
  readonly groups: readonly {
    readonly id: string
  }[]
  readonly links: readonly {
    readonly href: string
    readonly title: string
  }[]
  readonly points: number
  readonly title: string
  readonly viewableAfter: Date
}

/** Creates an assignment. */
export async function create(
  data: AssignmentCreateOptions
): Promise<Result<Assignment>> {
  const description = sanitize(data.description)

  try {
    // I know that using `var` is like a stab in the back by a friend you trust
    // most, but I'd rather use it than have a separate `let` and assignment,
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

  const groupMemberResult = await getGroupMembers(groupIds)

  if (!groupMemberResult.ok) {
    return groupMemberResult
  }

  const {
    managersOf: { all: managers },
    not,
  } = groupMemberResult.value

  const assignees = not(managers)

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
    due: data.due,
    groups: { connect: groupFilters },
    managers: managers.length
      ? { connect: managers.map((id) => ({ id })) }
      : undefined,
    points: data.points,
    statuses: assignees.length
      ? {
          createMany: {
            data: assignees.map((assigneeId) => ({
              assigneeId,
              due: data.due,
              exempt: false,
              missing: false,
            })),
          },
        }
      : undefined,
    title: data.title.slice(0, 100),
    viewableAfter: data.viewableAfter,
  })
}

/** Creates an assignment from raw database information. */
export async function rawCreate(data: Prisma.AssignmentCreateInput) {
  return await query((database) => database.assignment.create({ data }))
}

export const errorNoAssignmentExists = error(
  "No assignment exists that matches the given information."
)

/** Gets a specific assignment. */
export async function get(assignment: Prisma.AssignmentWhereUniqueInput) {
  return await query(
    (database) =>
      database.assignment.findUnique({
        where: assignment,
        include: {
          category: true,
          groups: true,
          statuses: {
            include: { assignee: true },
            orderBy: { assignee: { name: "asc" } },
          },
        },
      }),
    errorNoAssignmentExists
  )
}

/** Gets all assignments that have a specific manager. */
export async function getAllWithManager(
  manager: Prisma.AccountWhereUniqueInput
) {
  return await query(
    (database) =>
      database.account.findUnique({ where: manager }).managedAssignments({
        orderBy: { title: "asc" },
        include: { category: true, groups: true },
      }),
    Account.errorNoAccountExists
  )
}
