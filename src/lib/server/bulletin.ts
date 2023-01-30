import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query } from "./database"

/** A {@link Result} to return when no bulletins match a given filter. */
export const errorNoBulletinExists = error(
  "No bulletin exists that matches the given information."
)

export class Bulletin {
  static async create(
    data: Pick<Prisma.BulletinCreateInput, "author" | "body" | "title">
  ) {
    const bulletin = await query((database) =>
      database.bulletin.create({
        data,
      })
    )

    if (!bulletin.ok) {
      return bulletin
    }

    return ok(new Bulletin({ id: bulletin.value.id }))
  }

  constructor(readonly filter: Prisma.BulletinWhereUniqueInput) {}

  delete() {
    return query(
      (database) => database.bulletin.delete({ where: this.filter }),
      errorNoBulletinExists
    )
  }

  select<T extends Prisma.BulletinSelect>(select: T) {
    return query(
      (database) =>
        database.bulletin.findUniqueOrThrow({ where: this.filter, select }),
      errorNoBulletinExists
    )
  }

  update<
    T extends Prisma.BulletinUpdateInput,
    U extends Prisma.BulletinSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.bulletin.update({ where: this.filter, data, select }),
      errorNoBulletinExists
    )
  }

  async id() {
    if (this.filter.id) {
      return ok(this.filter.id)
    }

    const result = await this.select({ id: true })

    if (!result.ok) {
      return result
    }

    return ok(result.value.id)
  }
}

export class BulletinList {
  constructor(readonly filter: Prisma.BulletinWhereInput) {}

  count() {
    return query((database) => database.bulletin.count({ where: this.filter }))
  }

  select<T extends Prisma.BulletinSelect>(select: T) {
    return query((database) =>
      database.bulletin.findMany({
        select,
        orderBy: { creation: "desc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.BulletinUpdateInput>(data: T) {
    return query((database) =>
      database.bulletin.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.BulletinWhereInput) {
    return new BulletinList({
      ...this.filter,
      NOT: filter,
    })
  }
}
