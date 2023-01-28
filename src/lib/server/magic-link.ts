import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { Account, AccountList } from "./account"
import { query } from "./database"
import { send } from "./email"

/** A {@link Result} to return when no magicLinks match a given filter. */
export const errorNoMagicLinkExists = error(
  "No magic link exists that matches the given information."
)

export class MagicLink {
  static async create(data: Pick<Prisma.MagicLinkCreateInput, "for">) {
    const code = crypto.randomUUID()
    const expiration = new Date(Date.now() + 1000 * 60 * 15)

    const magicLink = await query((database) =>
      database.magicLink.create({
        data: {
          code,
          expiration,
          for: data.for,
        },
      })
    )

    if (!magicLink.ok) {
      return magicLink
    }

    return ok(new MagicLink({ id: magicLink.value.id }))
  }

  static async verify(code: string) {
    const link = new MagicLink({ code })

    {
      const result = await link.isExpired()

      if (!result.ok) {
        return result
      }

      if (!result.value) {
        return error("Your magic link expired. You can always request another.")
      }
    }

    const account = await link.select({ for: { select: { id: true } } })

    if (!account.ok) {
      return account
    }

    {
      const result = await link.delete()

      if (!result.ok) {
        return result
      }
    }

    if (account.value.for) {
      return ok(new Account({ id: account.value.for.id }))
    }

    return error("This magic link isn't connected to an account anymore.")
  }

  constructor(readonly filter: Prisma.MagicLinkWhereUniqueInput) {}

  delete() {
    return query(
      (database) => database.magicLink.delete({ where: this.filter }),
      errorNoMagicLinkExists
    )
  }

  async isExpired() {
    const result = await this.select({ expiration: true })

    if (!result.ok) {
      return result
    }

    return ok(result.value.expiration < new Date())
  }

  select<T extends Prisma.MagicLinkSelect>(select: T) {
    return query(
      (database) =>
        database.magicLink.findUniqueOrThrow({ where: this.filter, select }),
      errorNoMagicLinkExists
    )
  }

  update<
    T extends Prisma.MagicLinkUpdateInput,
    U extends Prisma.MagicLinkSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.magicLink.update({ where: this.filter, data, select }),
      errorNoMagicLinkExists
    )
  }

  account() {
    return new AccountList({ magicLink: this.filter }).first()
  }

  async sendVerificationEmail() {
    const result = await this.select({
      code: true,
      expiration: true,
      for: { select: { email: true, name: true } },
    })

    if (!result.ok) {
      return result
    }

    if (!result.value.for) {
      return error("This magic link isn't connected to an account anymore.")
    }

    const {
      value: {
        code,
        expiration,
        for: { email, name },
      },
    } = result

    if (expiration < new Date()) {
      return error("Your magic link expired. Try creating another.")
    }

    return await send({
      subject: `Log In to ${PUBLIC_KS_APP_NAME}`,
      text: `Hey ${name},

  It looks like you're trying to log in to your account. You can do this by going
  to ${PUBLIC_KS_APP_BASE}/log-in/${code}. Hurry
  up, as your link will expire in 15 minutes.`,
      to: {
        address: email,
        name: name,
      },
    })
  }
}
