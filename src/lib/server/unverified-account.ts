import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import { error, ok } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { Account, AccountList, defaultPermissions } from "./account"
import { query } from "./database"
import { send } from "./email"

/** A {@link Result} to return when no accounts match a given filter. */
export const errorNoUnverifiedAccountExists = error(
  "No unverified account exists that matches the given information."
)

export class UnverifiedAccount {
  static async create(
    data: Pick<Prisma.UnverifiedAccountCreateInput, "email" | "name">
  ) {
    const unverifiedAccountsWithSameEmail = await new UnverifiedAccountList({
      email: data.email,
    }).count()

    const accountsWithSameEmail = await new AccountList({
      email: data.email,
    }).count()

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

    const result = await query((database) =>
      database.unverifiedAccount.create({
        data: {
          email: data.email,
          name: data.name,
        },
        select: {
          id: true,
        },
      })
    )

    if (!result.ok) {
      return result
    }

    return ok(new UnverifiedAccount({ id: result.value.id }))
  }

  static async verify(id: string) {
    const unverifiedAccount = new UnverifiedAccount({ id })

    const data = await unverifiedAccount.select({
      creation: true,
      email: true,
      name: true,
    })

    if (!data.ok) {
      return data
    }

    return await Account.create({
      ...data.value,
      permissions: defaultPermissions.slice(),
    })
  }

  constructor(readonly filter: Prisma.UnverifiedAccountWhereUniqueInput) {}

  select<T extends Prisma.UnverifiedAccountSelect>(select: T) {
    return query(
      (database) =>
        database.unverifiedAccount.findUniqueOrThrow({
          select,
          where: this.filter,
        }),
      errorNoUnverifiedAccountExists
    )
  }

  update<
    T extends Prisma.UnverifiedAccountUpdateInput,
    U extends Prisma.UnverifiedAccountSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.unverifiedAccount.update({ data, select, where: this.filter }),
      errorNoUnverifiedAccountExists
    )
  }

  delete() {
    return query((database) =>
      database.unverifiedAccount.delete({ where: this.filter })
    )
  }

  async sendVerificationEmail() {
    const account = await this.select({
      email: true,
      id: true,
      name: true,
    })

    if (!account.ok) {
      return account
    }

    const {
      value: { name, id, email },
    } = account

    return await send({
      subject: "Verify your account on " + PUBLIC_KS_APP_NAME,
      text: `Hey ${name},
  You can now verify your account on ${PUBLIC_KS_APP_NAME}! Just click this link:
  ${PUBLIC_KS_APP_BASE}/sign-up/${id}
  If you didn't sign up, ignore this email and we'll take care of the rest.`,
      to: {
        address: email,
        name: name,
      },
    })
  }
}

export class UnverifiedAccountList {
  constructor(readonly filter: Prisma.UnverifiedAccountWhereInput) {}

  count() {
    return query((database) =>
      database.unverifiedAccount.count({ where: this.filter })
    )
  }

  select<T extends Prisma.UnverifiedAccountSelect>(select: T) {
    return query((database) =>
      database.unverifiedAccount.findMany({
        select,
        orderBy: { name: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.UnverifiedAccountUpdateInput>(data: T) {
    return query((database) =>
      database.unverifiedAccount.updateMany({ data, where: this.filter })
    )
  }

  delete() {
    return query((database) =>
      database.unverifiedAccount.deleteMany({ where: this.filter })
    )
  }
}
