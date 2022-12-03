import type { Account } from "@prisma/client"
import { error, type Result } from "../result"
import type { OneOf } from "../types"
import { query } from "./database"

/** Creates an account. */
export async function create(
  info: Pick<Account, "email" | "isAdmin" | "name">
): Promise<Result<Account>> {
  const accountsWithSameEmail = await query((database) =>
    database.account.count({
      where: {
        email: info.email,
      },
    })
  )

  if (!accountsWithSameEmail.ok) {
    return accountsWithSameEmail
  }

  if (accountsWithSameEmail.value > 0) {
    return error("An account already exists with the provided email address.")
  }

  return await query((database) =>
    database.account.create({
      data: {
        email: info.email,
        isAdmin: info.isAdmin,
        name: info.name,
      },
    })
  )
}

/** A {@link Result} to return when no accounts match a given filter. */
export const errorNoAccountExists = error(
  "No account exists that matches the given account information."
)

/** A filter that can be used to find a single account. */
export type AccountFilter = OneOf<
  Pick<Account, "email" | "id" | "magicLinkId" | "session">
>

/** Gets information about an account. */
export async function get(filter: AccountFilter): Promise<Result<Account>> {
  const result = await query(
    (database) =>
      database.account.findFirst({
        where: filter,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return result
}

/** Gets all accounts. */
export async function getAll(): Promise<Result<readonly Account[]>> {
  return await query((database) => database.account.findMany({}))
}
