import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query, transaction } from "./database"
import { GroupList } from "./group"
import { MagicLink } from "./magic-link"
import { ResourceList } from "./resource"
import { Session } from "./session"
import { UnverifiedAccountList } from "./unverified-account"

/** A {@link Result} to return when no accounts match a given filter. */
export const errorNoAccountExists = error(
  "No account exists that matches the given information."
)

export const permissions = Object.freeze([
  "admin",
  "create:account",
  "create:assignment",
  "create:card-deck",
  "create:discussion",
  "create:group",
  "create:resource",
] as const)

export type PermissionName = (typeof permissions)[number]

export class Account {
  static async create(
    data: Pick<Prisma.AccountCreateInput, "email" | "name" | "permissions">
  ) {
    {
      const result = await new UnverifiedAccountList({
        email: data.email,
      }).delete()

      if (!result.ok) {
        return result
      }
    }

    {
      const result = await new AccountList({ email: data.email }).count()

      if (!result.ok) {
        return result
      }

      if (result.value > 0) {
        return error(
          "An account already exists with the provided email address."
        )
      }
    }

    const account = await query((database) =>
      database.account.create({
        data: {
          email: data.email,
          name: data.name,
          permissions: data.permissions,
          session: { create: {} },
        },
      })
    )

    if (!account.ok) {
      return account
    }

    return ok(new Account({ id: account.value.id }))
  }

  constructor(readonly filter: Prisma.AccountWhereUniqueInput) {}

  select<T extends Prisma.AccountSelect>(select: T) {
    return query(
      (database) =>
        database.account.findUniqueOrThrow({ where: this.filter, select }),
      errorNoAccountExists
    )
  }

  update<
    T extends Prisma.AccountUpdateInput,
    U extends Prisma.AccountSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.account.update({ where: this.filter, data, select }),
      errorNoAccountExists
    )
  }

  async magicLink() {
    const result = await this.select({ magicLink: { select: { id: true } } })

    if (!result.ok) {
      return result
    }

    if (!result.value.magicLink) {
      return ok<MagicLink | undefined>(undefined)
    }

    return ok<MagicLink | undefined>(
      new MagicLink({ id: result.value.magicLink.id })
    )
  }

  async magicLinkForce() {
    const result = await this.select({ magicLink: { select: { id: true } } })

    if (!result.ok) {
      return result
    }

    if (!result.value.magicLink) {
      return await MagicLink.create({ for: { connect: this.filter } })
    }

    return ok(new MagicLink({ id: result.value.magicLink.id }))
  }

  async session() {
    const result = await this.select({ session: { select: { id: true } } })

    if (!result.ok) {
      return result
    }

    if (!result.value.session) {
      return await Session.create({ for: { connect: this.filter } })
    }

    return ok<Session>(new Session({ id: result.value.session.id }))
  }

  permissions(): Permission {
    return new Permission(this)
  }

  groups() {
    return new GroupList({
      members: { some: this.filter },
    })
  }

  managedGroups() {
    return new GroupList({
      managers: { some: this.filter },
    })
  }

  resources() {
    return new ResourceList({
      viewers: { some: this.filter },
    })
  }

  managedResources() {
    return new ResourceList({
      managers: { some: this.filter },
    })
  }

  async id() {
    if (this.filter.id && !this.filter.email) {
      return ok(this.filter.id)
    }

    const result = await this.select({ id: true })

    if (!result.ok) {
      return result
    }

    return ok(result.value.id)
  }
}

class Permission {
  constructor(readonly account: Account) {}

  grant(
    value:
      | "create:account"
      | "create:assignment"
      | "create:card-deck"
      | "create:discussion"
      | "create:group"
      | "create:resource"
  ) {
    return transaction(async (tx) => {
      const { permissions } = await tx.account.findUniqueOrThrow({
        where: this.account.filter,
        select: { permissions: true },
      })

      await tx.account.update({
        where: this.account.filter,
        data: {
          permissions: permissions
            .filter((permission) => permission != value)
            .concat(value),
        },
      })
    })
  }

  clear() {
    return this.account.update({ permissions: [] })
  }

  revoke(
    value:
      | "create:account"
      | "create:assignment"
      | "create:card-deck"
      | "create:discussion"
      | "create:group"
      | "create:resource"
  ) {
    return transaction(async (tx) => {
      const { permissions } = await tx.account.findUniqueOrThrow({
        where: this.account.filter,
        select: { permissions: true },
      })

      await tx.account.update({
        where: this.account.filter,
        data: {
          permissions: permissions.filter((permission) => permission != value),
        },
      })

      return {}
    })
  }

  async has(
    value:
      | "create:account"
      | "create:assignment"
      | "create:card-deck"
      | "create:discussion"
      | "create:group"
      | "create:resource"
  ): Promise<Result<boolean>> {
    const result = await this.account.select({ permissions: true })

    if (!result.ok) {
      return result
    }

    return ok(result.value.permissions.includes(value))
  }
}

export class AccountList {
  constructor(readonly filter: Prisma.AccountWhereInput) {}

  count() {
    return query((database) => database.account.count({ where: this.filter }))
  }

  async first() {
    const result = await this.select({ id: true })

    if (!result.ok) {
      return result
    }

    const first = result.value[0]

    if (!first) {
      return errorNoAccountExists
    }

    return ok(new Account(first))
  }

  select<T extends Prisma.AccountSelect>(select: T) {
    return query((database) =>
      database.account.findMany({
        select,
        orderBy: { name: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.AccountUpdateInput>(data: T) {
    return query((database) =>
      database.account.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.AccountWhereInput) {
    return new AccountList({
      ...this.filter,
      NOT: filter,
    })
  }
}
