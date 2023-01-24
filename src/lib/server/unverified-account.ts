import { error } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { AccountList } from "./account"
import { query } from "./database"

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

    return await query((database) =>
      database.unverifiedAccount.create({
        data: {
          email: data.email,
          name: data.name,
        },
      })
    )
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
