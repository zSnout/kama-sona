import type { Prisma } from "@prisma/client"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

/** Gets all groups that match a optional filter. */
export async function getAll(filter?: Prisma.CategoryWhereInput) {
  return await query((database) =>
    database.category.findMany({
      where: filter,
    })
  )
}

/** Gets all categories that belong to groups with a specific manager. */
export function getAllForGroupWithManager(
  manager: Prisma.AccountWhereUniqueInput
) {
  return query(
    (database) =>
      database.account.findUnique({ where: manager }).managerOf({
        include: {
          categories: {
            orderBy: { title: "asc" },
          },
        },
        orderBy: { title: "asc" },
      }),
    errorNoAccountExists
  )
}

/** Links a category to a list of groups. */
export function linkToGroups(
  category: Prisma.CategoryWhereUniqueInput,
  groups: Prisma.Enumerable<Prisma.GroupWhereUniqueInput>
) {
  return query((database) =>
    database.category.update({
      where: category,
      data: {
        groups: { connect: groups },
      },
    })
  )
}

/** Creates a category and links it to some groups. */
export function create(
  category: Prisma.CategoryCreateWithoutGroupsInput,
  groups: Prisma.Enumerable<Prisma.GroupWhereUniqueInput>
) {
  return query((database) =>
    database.category.create({
      data: {
        ...category,
        groups: { connect: groups },
      },
    })
  )
}
