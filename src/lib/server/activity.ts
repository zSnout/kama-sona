import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { activityList } from "./activity-list"
import { query } from "./database"

/** A {@link Result} to return when no activities match a given filter. */
export const errorNoActivityExists = error(
  "No activity exists that matches the given information."
)

export type ActivityCreateInput = Pick<
  Prisma.ActivityCreateInput,
  "creation" | "title" | "type"
> & { options?: readonly string[] }

export class Activity {
  static async create(data: ActivityCreateInput) {
    const activity = await query((database) =>
      database.activity.create({
        data: {
          ...data,
          creation: data.creation
            ? new Date(data.creation + "T12:00:00")
            : undefined,
          options: data.options?.map((title) => ({ title, votes: [] })),
        },
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

    const middle = new Date(lastMidnight)
    middle.setHours(12, 0, 0, 0)

    const nextMidnight = new Date(lastMidnight)
    nextMidnight.setHours(24)

    const activity = await query(async (database) => {
      const existing = await database.activity.findFirst({
        select: {
          id: true,
        },
        where: {
          creation: {
            gte: lastMidnight,
            lt: nextMidnight,
          },
        },
      })

      if (existing) {
        return existing
      }

      const created = await Activity.create(getActivityInput(middle))
      return created.value
    })

    if (!activity.ok) {
      return activity
    }

    if (activity.value instanceof Activity) {
      return ok(activity.value)
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

export function getActivityInput(date: Date): ActivityCreateInput {
  const dateString =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")

  const activity = activityList.find(
    (activity) => activity.creation == dateString
  )

  if (activity) {
    return activity
  }

  return {
    creation: date,
    title:
      "No activity was planned for " +
      date.toLocaleDateString(undefined, { month: "long", day: "numeric" }) +
      ". Discuss whatever topic you like!",
    type: "Poll",
  }
}
