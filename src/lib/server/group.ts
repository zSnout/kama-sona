import type { Group, Prisma } from "@prisma/client"
import { type Result } from "../result"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

export function create(options: {
  account: Prisma.AccountWhereUniqueInput
  group: Prisma.GroupCreateInput
}): Promise<Result<Group>> {
  const { account, group } = options

  return query(
    (database) =>
      database.group.create({
        data: {
          ...group,
          members: {
            connect: account,
          },
        },
      }),
    errorNoAccountExists
  )
}
