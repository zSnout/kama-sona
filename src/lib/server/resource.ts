import {
  error,
  isUnwrap500Error,
  ok,
  unwrapOr500,
  type Result,
} from "$lib/result"
import { intersect, union } from "$lib/set"
import type { Prisma } from "@prisma/client"
import { query } from "./database"
import { GroupList } from "./group"
import { sanitize } from "./sanitize"
import { upload } from "./upload"

/** A {@link Result} to return when no resources match a given filter. */
export const errorNoResourceExists = error(
  "No resource exists that matches the given information."
)

export interface ResourceCreateInput {
  category: { name: string; weight: number } | { id: string }
  description: string
  files: File[]
  groupIds: string[]
  links: { href: string; title: string }[]
  title: string
  viewableAfter: Date
}

export class Resource {
  static async create(data: ResourceCreateInput) {
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

    const category: Prisma.CategoryCreateNestedOneWithoutResourcesInput = {
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
    const viewerIds = union(ids.value.map((e) => e.memberIds))

    const resource = await query((database) =>
      database.resource.create({
        data: {
          attachments,
          category,
          description,
          groupIds: data.groupIds,
          managerIds,
          title: data.title.slice(0, 100),
          viewerIds,
          viewableAfter: data.viewableAfter,
        },
      })
    )

    if (!resource.ok) {
      return resource
    }

    return ok(new Resource({ id: resource.value.id }))
  }

  constructor(readonly filter: Prisma.ResourceWhereUniqueInput) {}

  select<T extends Prisma.ResourceSelect>(select: T) {
    return query(
      (database) =>
        database.resource.findUniqueOrThrow({ where: this.filter, select }),
      errorNoResourceExists
    )
  }

  update<
    T extends Prisma.ResourceUpdateInput,
    U extends Prisma.ResourceSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.resource.update({ where: this.filter, data, select }),
      errorNoResourceExists
    )
  }

  async id() {
    if (this.filter.id) {
      return ok(this.filter.id)
    }

    const result = await this.select({ id: true })

    if (!result.ok) {
      return result
    }

    return ok(result.value.id)
  }
}

export class ResourceList {
  constructor(readonly filter: Prisma.ResourceWhereInput) {}

  count() {
    return query((database) => database.resource.count({ where: this.filter }))
  }

  select<T extends Prisma.ResourceSelect>(select: T) {
    return query((database) =>
      database.resource.findMany({
        select,
        orderBy: { title: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.ResourceUpdateInput>(data: T) {
    return query((database) =>
      database.resource.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.ResourceWhereInput) {
    return new ResourceList({
      ...this.filter,
      NOT: filter,
    })
  }
}
