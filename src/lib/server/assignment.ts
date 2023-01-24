import {
  error,
  isUnwrap500Error,
  ok,
  unwrapOr500,
  type Result,
} from "$lib/result"
import { exclude, intersect, union } from "$lib/set"
import type { Prisma } from "@prisma/client"
import { query } from "./database"
import { GroupList } from "./group"
import { sanitize } from "./sanitize"
import { upload } from "./upload"

/** A {@link Result} to return when no assignments match a given filter. */
export const errorNoAssignmentExists = error(
  "No assignment exists that matches the given information."
)

export interface AssignmentCreateInput {
  category: { name: string; weight: number } | { id: string }
  description: string
  due: Date
  files: File[]
  groupIds: string[]
  links: { href: string; title: string }[]
  points: number
  title: string
  viewableAfter: Date
}

export class Assignment {
  static async create(data: AssignmentCreateInput) {
    try {
      var attachments: Prisma.AttachmentCreateInput[] = await Promise.all(
        data.files.map(async (file) => ({
          type: "File",
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
        type: "Link",
        content: href,
        label: title,
      })
    })

    const groupFilters = data.groupIds.map((id) => ({ id }))

    const category: Prisma.CategoryCreateNestedOneWithoutAssignmentsInput = {
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
    }

    const description = sanitize(data.description)

    const ids = await new GroupList({ id: { in: data.groupIds } }).select({
      managerIds: true,
      memberIds: true,
    })

    if (!ids.ok) {
      return ids
    }

    const managerIds = intersect(ids.value.map((e) => e.managerIds))

    const assigneeIds = exclude(
      union(ids.value.map((e) => e.memberIds)),
      managerIds
    )

    const assignment = await query((database) =>
      database.assignment.create({
        data: {
          attachments,
          category,
          description,
          due: data.due,
          groupIds: data.groupIds,
          managerIds,
          points: data.points,
          statuses: {
            createMany: {
              data: assigneeIds.map((assigneeId) => ({
                assigneeId,
                due: data.due,
                exempt: false,
                missing: false,
              })),
            },
          },
          title: data.title.slice(0, 100),
          viewableAfter: data.viewableAfter,
        },
      })
    )

    if (!assignment.ok) {
      return assignment
    }

    return ok(new Assignment({ id: assignment.value.id }))
  }

  constructor(readonly filter: Prisma.AssignmentWhereUniqueInput) {}

  select<T extends Prisma.AssignmentSelect>(select: T) {
    return query(
      (database) =>
        database.assignment.findUniqueOrThrow({ where: this.filter, select }),
      errorNoAssignmentExists
    )
  }

  update<
    T extends Prisma.AssignmentUpdateInput,
    U extends Prisma.AssignmentSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.assignment.update({ where: this.filter, data, select }),
      errorNoAssignmentExists
    )
  }
}

export class AssignmentList {
  constructor(readonly filter: Prisma.AssignmentWhereInput) {}

  count() {
    return query((database) =>
      database.assignment.count({ where: this.filter })
    )
  }

  select<T extends Prisma.AssignmentSelect>(select: T) {
    return query((database) =>
      database.assignment.findMany({
        select,
        orderBy: { title: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.AssignmentUpdateInput>(data: T) {
    return query((database) =>
      database.assignment.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.AssignmentWhereInput) {
    return new AssignmentList({
      ...this.filter,
      NOT: filter,
    })
  }
}
