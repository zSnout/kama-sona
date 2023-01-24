import { error, ok } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { AccountList } from "./account"
import { query } from "./database"

/** A {@link Result} to return when no accounts match a given filter. */
export const errorNoGroupExists = error(
  "No group exists that matches the given information."
)

export class Group {
  static async create(data: Prisma.GroupCreateInput) {
    const result = await query((database) =>
      database.group.create({ data, select: { id: true } })
    )

    if (!result.ok) {
      return result
    }

    return ok(new Group({ id: result.value.id }))
  }

  constructor(readonly filter: Prisma.GroupWhereUniqueInput) {}

  select<T extends Prisma.GroupSelect>(select: T) {
    return query(
      (database) =>
        database.group.findUniqueOrThrow({ where: this.filter, select }),
      errorNoGroupExists
    )
  }

  update<T extends Prisma.GroupUpdateInput, U extends Prisma.GroupSelect = {}>(
    data: T,
    select?: U
  ) {
    return query(
      (database) => database.group.update({ where: this.filter, data, select }),
      errorNoGroupExists
    )
  }

  members(): AccountList {
    return new AccountList({ memberOf: { some: this.filter } })
  }

  managers(): AccountList {
    return new AccountList({ managerOf: { some: this.filter } })
  }
}

export class GroupList {
  constructor(readonly filter: Prisma.GroupWhereInput) {}

  count() {
    return query((database) => database.group.count({ where: this.filter }))
  }

  select<T extends Prisma.GroupSelect>(select: T) {
    return query((database) =>
      database.group.findMany({
        select,
        orderBy: { title: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.GroupUpdateInput>(data: T) {
    return query((database) =>
      database.group.updateMany({ where: this.filter, data })
    )
  }

  membersOfSome(): AccountList {
    return new AccountList({ memberOf: { some: this.filter } })
  }

  membersOfAll(): AccountList {
    return new AccountList({ memberOf: { every: this.filter } })
  }

  managersOfSome(): AccountList {
    return new AccountList({ managerOf: { some: this.filter } })
  }

  managersOfAll(): AccountList {
    return new AccountList({ managerOf: { every: this.filter } })
  }
}
