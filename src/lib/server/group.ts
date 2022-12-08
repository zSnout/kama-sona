import type { Account, Group, Prisma } from "@prisma/client"
import { error, type Result } from "../result"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

/** Creates a group with a specified manager. */
export function create(options: {
  group: Prisma.GroupCreateInput
  manager: Prisma.AccountWhereUniqueInput
}): Promise<Result<Group>> {
  const { manager: account, group } = options

  return query(
    (database) =>
      database.group.create({
        data: {
          ...group,
          managers: { connect: account },
          members: { connect: account },
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
export async function get(
  filter: Prisma.GroupWhereUniqueInput
): Promise<Result<Group>> {
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
export async function getAll(
  filter?: Prisma.GroupWhereInput
): Promise<Result<readonly Group[]>> {
  return await query((database) =>
    database.group.findMany({
      where: filter,
    })
  )
}

/** Gets all groups that have a specific member. */
export async function getAllWithMember(
  member?: Prisma.AccountWhereUniqueInput
): Promise<Result<readonly Group[]>> {
  return await query(
    (database) => database.account.findFirst({ where: member }).memberOf(),
    errorNoAccountExists
  )
}

/** Gets information about a group, including its manager and member lists. */
export async function getWithMembers(
  group: Prisma.GroupWhereUniqueInput
): Promise<
  Result<
    Group & {
      readonly managers: readonly Account[]
      readonly members: readonly Account[]
    }
  >
> {
  return await query(
    (database) =>
      database.group.findUnique({
        where: group,
        include: { managers: true, members: true },
      }),
    errorNoGroupExists
  )
}
