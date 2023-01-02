import type { Account, Group, Prisma } from "@prisma/client"
import { error, type Result } from "../result"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

/** Creates a group with a specified manager. */
export function create(options: {
  group: Omit<
    Prisma.GroupCreateInput,
    "managers" | "managerIds" | "members" | "memberIds"
  >
  manager: Prisma.Enumerable<Prisma.AccountWhereUniqueInput>
  members?: Prisma.Enumerable<Prisma.AccountWhereUniqueInput>
}) {
  const { manager, members, group } = options

  return query(
    (database) =>
      database.group.create({
        data: {
          ...group,
          managers: { connect: manager },
          members: { connect: members || manager },
        },
      }),
    errorNoAccountExists
  )
}

/** A {@link Result} to return when no groups match a given filter. */
export const errorNoGroupExists = error(
  "No group exists that matches the given information."
)

/** Gets information about a group. */
export async function get(filter: Prisma.GroupWhereUniqueInput) {
  const result = await query(
    (database) =>
      database.group.findUnique({
        where: filter,
      }),
    errorNoGroupExists
  )

  return result
}

/** Gets all groups that match a optional filter. */
export async function getAll(filter?: Prisma.GroupWhereInput) {
  return await query((database) =>
    database.group.findMany({
      where: filter,
      orderBy: { title: "asc" },
    })
  )
}

/** Gets all groups that have a specific manager. */
export async function getAllWithManager(
  member: Prisma.AccountWhereUniqueInput
) {
  return await query(
    (database) =>
      database.account
        .findUnique({ where: member })
        .managerOf({ orderBy: { title: "asc" } }),
    errorNoAccountExists
  )
}

/** Gets all groups that have a specific member. */
export async function getAllWithMember(member: Prisma.AccountWhereUniqueInput) {
  return await query(
    (database) =>
      database.account
        .findUnique({ where: member })
        .memberOf({ orderBy: { title: "asc" } }),
    errorNoAccountExists
  )
}

/** Gets information about a group, including its manager and member lists. */
export async function getWithMembers(group: Prisma.GroupWhereUniqueInput) {
  return await query(
    (database) =>
      database.group.findUnique({
        where: group,
        include: { managers: true, members: true },
      }),
    errorNoGroupExists
  )
}

/** Updates information about a group. */
export async function update(
  filter: Prisma.GroupWhereUniqueInput,
  data: Prisma.GroupUpdateInput
) {
  return await query(
    (database) => database.group.update({ where: filter, data }),
    errorNoGroupExists
  )
}
