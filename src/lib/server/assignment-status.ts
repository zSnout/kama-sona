import { error, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { Assignment } from "./assignment"
import { query } from "./database"

/** A {@link Result} to return when no assignment statuses match a given filter. */
export const errorNoAssignmentStatusExists = error(
  "No assignment status exists that matches the given information."
)

export class AssignmentStatus {
  constructor(readonly filter: Prisma.AssignmentStatusWhereUniqueInput) {}

  select<T extends Prisma.AssignmentStatusSelect>(select: T) {
    return query(
      (database) =>
        database.assignmentStatus.findUniqueOrThrow({
          where: this.filter,
          select,
        }),
      errorNoAssignmentStatusExists
    )
  }

  update<
    T extends Prisma.AssignmentStatusUpdateInput,
    U extends Prisma.AssignmentStatusSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.assignmentStatus.update({ where: this.filter, data, select }),
      errorNoAssignmentStatusExists
    )
  }

  async assignment() {
    const result = await this.select({ assignmentId: true })

    if (!result.ok) {
      return result
    }

    return new Assignment({ id: result.value.assignmentId })
  }
}

export class AssignmentStatusList {
  constructor(readonly filter: Prisma.AssignmentStatusWhereInput) {}

  count() {
    return query((database) =>
      database.assignmentStatus.count({ where: this.filter })
    )
  }

  select<T extends Prisma.AssignmentStatusSelect>(select: T) {
    return query((database) =>
      database.assignmentStatus.findMany({
        select,
        orderBy: { assignee: { name: "asc" } },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.AssignmentStatusUpdateInput>(data: T) {
    return query((database) =>
      database.assignmentStatus.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.AssignmentStatusWhereInput) {
    return new AssignmentStatusList({
      ...this.filter,
      NOT: filter,
    })
  }
}
