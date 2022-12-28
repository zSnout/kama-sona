import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import { error, ok, type Result } from "$lib/result"
import type {
  Account as PrismaAccount,
  Prisma,
  UnverifiedAccount,
} from "@prisma/client"
import * as Account from "./account"
import { query } from "./database"
import { send } from "./email"

/** Counts the number of unverified accounts matching a given filter. */
export async function count(
  filter?: Prisma.UnverifiedAccountWhereInput
): Promise<Result<number>> {
  return await query((database) =>
    database.unverifiedAccount.count({ where: filter })
  )
}

/** Deletes old unverified accounts. */
export async function deleteOld(
  filter?: Prisma.UnverifiedAccountWhereUniqueInput
): Promise<Result<void>> {
  const result = await query((database) =>
    database.unverifiedAccount.deleteMany({ where: filter })
  )

  if (!result.ok) {
    return result
  }

  return ok()
}

/** Creates an unverified account. */
export async function create(
  info: Prisma.UnverifiedAccountCreateInput
): Promise<Result<UnverifiedAccount>> {
  const unverifiedAccountsWithSameEmail = await count({ email: info.email })
  const accountsWithSameEmail = await Account.count({ email: info.email })

  if (!unverifiedAccountsWithSameEmail.ok) {
    return unverifiedAccountsWithSameEmail
  }

  if (!accountsWithSameEmail.ok) {
    return accountsWithSameEmail
  }

  if (
    unverifiedAccountsWithSameEmail.value > 0 ||
    accountsWithSameEmail.value > 0
  ) {
    return error("An account already exists with the provided email address.")
  }

  return await query((database) =>
    database.unverifiedAccount.create({
      data: {
        email: info.email,
        name: info.name,
      },
    })
  )
}

/** Gets an unverified account. */
export async function get(
  filter: Prisma.UnverifiedAccountWhereUniqueInput
): Promise<Result<UnverifiedAccount>> {
  return query(
    (database) => database.unverifiedAccount.findUnique({ where: filter }),
    Account.errorNoAccountExists
  )
}

/** Sends a link to verify an unverified account to the account's email. */
export async function sendVerification(
  account: UnverifiedAccount
): Promise<Result<void>> {
  return await send({
    subject: "Verify your account on " + PUBLIC_KS_APP_NAME,
    text: `Hey ${account.name},

You can now verify your account on ${PUBLIC_KS_APP_NAME}! Just click this link:
${PUBLIC_KS_APP_BASE}/sign-up/${account.id}

If you didn't sign up, ignore this email and we'll take care of the rest.`,
    to: {
      address: account.email,
      name: account.name,
    },
  })
}

/** Deletes an unverified account. */
async function remove(
  filter: Prisma.UnverifiedAccountWhereUniqueInput
): Promise<Result<void>> {
  const result = await query((database) =>
    database.unverifiedAccount.deleteMany({ where: filter })
  )

  if (!result.ok) {
    return result
  }

  return ok()
}

export { remove as delete }

/** Verifies an unverified account and makes it an official account. */
export async function verify(id: string): Promise<Result<PrismaAccount>> {
  const account = await get({ id })

  if (!account.ok) {
    return account
  }

  const removed = await remove({ id: account.value.id })

  if (!removed.ok) {
    return removed
  }

  const next = await Account.create({
    creation: account.value.creation,
    email: account.value.email,
    isAdmin: false,
    name: account.value.name,
  })

  return next
}
