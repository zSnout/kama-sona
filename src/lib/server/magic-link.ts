import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import type { Account } from "@prisma/client"
import cuid from "cuid"
import { error, ok, type Result } from "../result"
import { errorNoAccountExists, type AccountFilter } from "./account"
import { query } from "./database"
import { send as sendEmail } from "./email"

/** Information about a magic link. The ID may not be present. */
export interface MagicLinkInfo {
  /** The expiration date of this magic link. */
  readonly expiration: Date

  /** The ID of this magic link. */
  readonly id: string | null
}

/** Information about a magic link with a definite ID. */
export interface MagicLinkInfoWithID {
  /** The ID of this magic link. */
  id: string
}

/** Creates a magic link for the given account and returns it. */
export async function create(
  account: AccountFilter
): Promise<Result<MagicLinkInfoWithID>> {
  const expiration = new Date(Date.now() + 1000 * 60 * 15)
  const id = cuid()

  const result = await query(
    (database) =>
      database.account.update({
        data: {
          magicLinkExpiration: expiration,
          magicLinkId: id,
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok({ expiration, id })
}

/** Destroys a magic link for the given account. */
export async function destroy(account: AccountFilter): Promise<Result<void>> {
  const result = await query(
    (database) =>
      database.account.updateMany({
        data: {
          magicLinkExpiration: new Date(),
          magicLinkId: cuid(),
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return result.value.count > 0 ? ok() : errorNoAccountExists
}

/** Gets the magic link ID and expiration date of a given account. */
export async function get(
  account: AccountFilter
): Promise<Result<MagicLinkInfo>> {
  const result = await query(
    (database) =>
      database.account.findFirst({
        select: {
          magicLinkExpiration: true,
          magicLinkId: true,
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  return ok({
    expiration: result.value.magicLinkExpiration,
    id: result.value.magicLinkId,
  })
}

/** Sends the current magic link ID to an account. */
export async function send(account: AccountFilter): Promise<Result<void>> {
  const result = await query(
    (database) =>
      database.account.findFirst({
        select: {
          email: true,
          magicLinkExpiration: true,
          magicLinkId: true,
          name: true,
        },
        where: account,
      }),
    errorNoAccountExists
  )

  if (!result.ok) {
    return result
  }

  const expiration = result.value.magicLinkExpiration

  if (expiration < new Date()) {
    return error("The magic link expired. Try creating another.")
  }

  const result2 = await sendEmail({
    subject: `Log In to ${PUBLIC_KS_APP_NAME}`,
    text: `Hey ${result.value.name},

It looks like you're trying to log in to your account. You can do this by going
to ${PUBLIC_KS_APP_BASE}/log-in/${result.value.magicLinkId}. Hurry
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

/** Verifies a magic link, destroys it, and returns the account it corresponds to. */
export async function verify(magicLinkId: string): Promise<Result<Account>> {
  const account = await query(
    (database) =>
      database.account.findFirst({
        where: { magicLinkId },
      }),
    errorNoAccountExists
  )

  if (!account.ok) {
    return account
  }

  if (account.value.magicLinkExpiration < new Date()) {
    return error("The magic link expired. You can always request another.")
  }

  const destroyed = await destroy({ magicLinkId })

  if (!destroyed.ok) {
    return destroyed
  }

  return account
}
