import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query } from "./database"

/** A {@link Result} to return when no activities match a given filter. */
export const errorNoActivityExists = error(
  "No activity exists that matches the given information."
)

export class Activity {
  static async create(
    data: Pick<Prisma.ActivityCreateInput, "options" | "title" | "type">
  ) {
    const activity = await query((database) =>
      database.activity.create({
        data,
      })
    )

    if (!activity.ok) {
      return activity
    }

    return ok(new Activity({ id: activity.value.id }))
  }

  static async today() {
    const lastMidnight = new Date()
    lastMidnight.setHours(0, 0, 0, 0)

    const nextMidnight = new Date(lastMidnight)
    nextMidnight.setHours(24)

    const activity = await query((database) =>
      database.activity.findFirst({
        where: {
          creation: {
            gte: lastMidnight,
            lt: nextMidnight,
          },
        },
      })
    )

    if (!activity.ok) {
      return activity
    }

    return ok(new Activity({ id: activity.value.id }))
  }

  constructor(readonly filter: Prisma.ActivityWhereUniqueInput) {}

  select<T extends Prisma.ActivitySelect>(select: T) {
    return query(
      (database) =>
        database.activity.findUniqueOrThrow({ where: this.filter, select }),
      errorNoActivityExists
    )
  }

  update<
    T extends Prisma.ActivityUpdateInput,
    U extends Prisma.ActivitySelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.activity.update({ where: this.filter, data, select }),
      errorNoActivityExists
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

export class ActivityList {
  constructor(readonly filter: Prisma.ActivityWhereInput) {}

  count() {
    return query((database) => database.activity.count({ where: this.filter }))
  }

  select<T extends Prisma.ActivitySelect>(select: T) {
    return query((database) =>
      database.activity.findMany({
        select,
        orderBy: { creation: "desc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.ActivityUpdateInput>(data: T) {
    return query((database) =>
      database.activity.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.ActivityWhereInput) {
    return new ActivityList({
      ...this.filter,
      NOT: filter,
    })
  }
}
