import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query } from "./database"

// TODO: Change all occurrences of "thing."

/** A {@link Result} to return when no things match a given filter. */
export const errorNoThingExists = error(
  "No thing exists that matches the given information."
)

export class Thing {
  static async create(data: Pick<Prisma.ThingCreateInput, never>) {
    const thing = await query((database) =>
      database.thing.create({
        data: {
          // TODO: Add a custom create function
          ...data,
        },
      })
    )

    if (!thing.ok) {
      return thing
    }

    return ok(new Thing({ id: thing.value.id }))
  }

  constructor(readonly filter: Prisma.ThingWhereUniqueInput) {}

  // TODO: Remove this if 'delete' doesn't make sense for the current thing.
  delete() {
    return query(
      (database) => database.thing.delete({ where: this.filter }),
      errorNoThingExists
    )
  }

  select<T extends Prisma.ThingSelect>(select: T) {
    return query(
      (database) =>
        database.thing.findUniqueOrThrow({ where: this.filter, select }),
      errorNoThingExists
    )
  }

  update<T extends Prisma.ThingUpdateInput, U extends Prisma.ThingSelect = {}>(
    data: T,
    select?: U
  ) {
    return query(
      (database) => database.thing.update({ where: this.filter, data, select }),
      errorNoThingExists
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

export class ThingList {
  constructor(readonly filter: Prisma.ThingWhereInput) {}

  count() {
    return query((database) => database.thing.count({ where: this.filter }))
  }

  // TODO: Remove this unless it's actually valuable
  async first() {
    const result = await this.select({ id: true })

    if (!result.ok) {
      return result
    }

    const first = result.value[0]

    if (!first) {
      return errorNoThingExists
    }

    return ok(new Thing(first))
  }

  select<T extends Prisma.ThingSelect>(select: T) {
    return query((database) =>
      database.thing.findMany({
        select,
        // TODO: Change ordering to be logical
        orderBy: { title: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.ThingUpdateInput>(data: T) {
    return query((database) =>
      database.thing.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.ThingWhereInput) {
    return new ThingList({
      ...this.filter,
      NOT: filter,
    })
  }
}
