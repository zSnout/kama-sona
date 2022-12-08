import type { Account, Prisma } from "@prisma/client"
import type { Cookies } from "@sveltejs/kit"
import { error, or, type Result } from "../result"
import { query } from "./database"
import * as UnverifiedAccount from "./unverified-account"

/** Counts the number of accounts matching a given filter. */
export async function count(
  filter?: Prisma.AccountWhereInput
): Promise<Result<number>> {
  return await query((database) => database.account.count({ where: filter }))
}

/** Creates an account. */
export async function create(
  info: Omit<Prisma.AccountCreateInput, "session">
): Promise<Result<Account>> {
  await UnverifiedAccount.deleteOld({ email: info.email })

  const accountsWithSameEmail = await count({ email: info.email })

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
        session: { create: {} },
      },
    })
  )
}

/** A {@link Result} to return when no accounts match a given filter. */
export const errorNoAccountExists = error(
  "No account exists that matches the given information."
)

/** Gets information about an account. */
export async function get(
  filter: Prisma.AccountWhereUniqueInput
): Promise<Result<Account>> {
  const result = await query(
    (database) =>
      database.account.findUnique({
        where: filter,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return result
}

/** Gets all accounts with an optional filter. */
export async function getAll(
  filter?: Prisma.AccountWhereInput
): Promise<Result<readonly Account[]>> {
  return await query((database) =>
    database.account.findMany({
      where: filter,
    })
  )
}

/** Gets an account based on the session key stored in a user's cookies. */
export async function getFromCookies(
  cookies: Cookies
): Promise<Result<Account>> {
  const session = cookies.get("session")

  if (!session) {
    return error("Whoops! Looks like you aren't logged in.")
  }

  return or(
    await query((database) =>
      database.session
        .findUnique({
          where: { code: session },
        })
        .for()
    ),
    error("It appears that your session has expired.")
  )
}
