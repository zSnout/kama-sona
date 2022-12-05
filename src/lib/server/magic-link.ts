import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import type { Account, Prisma } from "@prisma/client"
import { both, error, ok, type Result } from "../result"
import { errorNoAccountExists } from "./account"
import { query } from "./database"
import { send as sendEmail } from "./email"

/** Information about a magic link. The code may not be present. */
export interface MagicLinkInfo {
  /** The code of this magic link. */
  readonly code: string | null

  /** The expiration date of this magic link. */
  readonly expiration: Date
}

/** Information about a magic link with a definite code. */
export interface MagicLinkInfoWithCode extends MagicLinkInfo {
  /** The code of this magic link. */
  readonly code: string
}

/** Creates a magic link for the given account and returns it. */
export async function create(
  account: Prisma.AccountWhereUniqueInput
): Promise<Result<MagicLinkInfoWithCode>> {
  const expiration = new Date(Date.now() + 1000 * 60 * 15)
  const code = crypto.randomUUID()

  const result = await query(
    (database) =>
      database.account.update({
        data: {
          magicLink: {
            upsert: {
              create: { code, expiration },
              update: { code, expiration },
            },
          },
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok({ expiration, code })
}

/** Destroys a magic link for the given account. */
export async function destroyByAccount(
  account: Prisma.AccountWhereUniqueInput
): Promise<Result<void>> {
  const next = {
    code: crypto.randomUUID(),
    expiration: new Date(),
  }

  const result = await query(
    (database) =>
      database.account.update({
        data: {
          magicLink: {
            upsert: {
              create: next,
              update: next,
            },
          },
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok()
}

/** Destroys the given magic link. */
export async function destroyByLink(
  link: Prisma.MagicLinkWhereUniqueInput
): Promise<Result<void>> {
  const result = await query(
    (database) => database.magicLink.delete({ where: link }),
    error("The provided magic link doesn't exist. It might've expired by now.")
  )

  if (!result.ok) {
    return result
  }

  return ok()
}

/** Gets the magic link code and expiration date of a given account. */
export async function get(
  account: Prisma.AccountWhereUniqueInput
): Promise<Result<MagicLinkInfo>> {
  const result = await query(
    async (database) =>
      (await database.account
        .findFirst({
          where: account,
        })
        .magicLink()) ?? ("none" as const),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok(
    result.value == "none"
      ? { code: null, expiration: new Date() }
      : result.value
  )
}

/** Sends the current magic link code to an account. */
export async function send(
  account: Prisma.AccountWhereUniqueInput
): Promise<Result<void>> {
  const result = await query(
    (database) =>
      database.account.findFirst({
        select: {
          email: true,
          name: true,
          magicLink: true,
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  if (!result.value.magicLink) {
    return error("Your magic link expired. Try creating another.")
  }

  const expiration = result.value.magicLink?.expiration

  if (expiration < new Date()) {
    return error("Your magic link expired. Try creating another.")
  }

  const result2 = await sendEmail({
    subject: `Log In to ${PUBLIC_KS_APP_NAME}`,
    text: `Hey ${result.value.name},

It looks like you're trying to log in to your account. You can do this by going
to ${PUBLIC_KS_APP_BASE}/log-in/${result.value.magicLink.code}. Hurry
up, as your link will expire in 15 minutes.`,
    to: {
      address: result.value.email,
      name: result.value.name,
    },
  })

  if (!result2.ok) {
    return result2
  }

  return ok()
}

/** A {@link Result} to result when an account's magic link changed unexpectedly. */
export const errorMagicLinkChanged = error(
  "Your magic link has changed. You might've requested another log in link and clicked this one by accident."
)

/** Verifies a magic link, destroys it, and returns the account it corresponds to. */
export async function verify(options: {
  code: string
}): Promise<Result<Account>> {
  const link = await query(
    (database) =>
      database.magicLink.findFirst({
        include: { for: true },
        where: options,
      }),
    errorMagicLinkChanged
  )

  if (!link.ok) {
    return link
  }

  if (!link.value.for) {
    return errorMagicLinkChanged
  }

  if (link.value.expiration < new Date()) {
    return error("Your magic link expired. You can always request another.")
  }

  const destroyed = await destroyByLink(options)

  if (!destroyed.ok) {
    return destroyed
  }

  return ok(link.value.for)
}
