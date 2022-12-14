import type { Result } from "$lib/result"
import type { Category, Group, Prisma } from "@prisma/client"
import { errorNoAccountExists } from "./account"
import { query } from "./database"

/** Gets all categories that belong to groups with a specific manager. */
export async function getAllForGroupWithManager(
  manager: Prisma.AccountWhereUniqueInput
): Promise<Result<(Group & { categories: Category[] })[]>> {
  return await query(
    (database) =>
      database.account.findUnique({ where: manager }).managerOf({
        include: {
          categories: {
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),
    errorNoAccountExists
  )
}
