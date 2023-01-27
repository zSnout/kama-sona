import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query } from "./database"

/** A {@link Result} to return when no passkeyChallenges match a given filter. */
export const errorNoPasskeyChallengeExists = error(
  "No passkey challenge exists that matches the given information."
)

export class PasskeyChallenge {
  static async create(
    data: Pick<Prisma.PasskeyChallengeCreateInput, "challenge">
  ) {
    const passkeyChallenge = await query((database) =>
      database.passkeyChallenge.create({
        data,
      })
    )

    if (!passkeyChallenge.ok) {
      return passkeyChallenge
    }

    return ok(new PasskeyChallenge({ id: passkeyChallenge.value.id }))
  }

  constructor(readonly filter: Prisma.PasskeyChallengeWhereUniqueInput) {}

  delete() {
    return query(
      (database) => database.passkeyChallenge.delete({ where: this.filter }),
      errorNoPasskeyChallengeExists
    )
  }

  select<T extends Prisma.PasskeyChallengeSelect>(select: T) {
    return query(
      (database) =>
        database.passkeyChallenge.findUniqueOrThrow({
          where: this.filter,
          select,
        }),
      errorNoPasskeyChallengeExists
    )
  }

  update<
    T extends Prisma.PasskeyChallengeUpdateInput,
    U extends Prisma.PasskeyChallengeSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.passkeyChallenge.update({ where: this.filter, data, select }),
      errorNoPasskeyChallengeExists
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

export class PasskeyChallengeList {
  constructor(readonly filter: Prisma.PasskeyChallengeWhereInput) {}

  count() {
    return query((database) =>
      database.passkeyChallenge.count({ where: this.filter })
    )
  }

  select<T extends Prisma.PasskeyChallengeSelect>(select: T) {
    return query((database) =>
      database.passkeyChallenge.findMany({
        select,
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.PasskeyChallengeUpdateInput>(data: T) {
    return query((database) =>
      database.passkeyChallenge.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.PasskeyChallengeWhereInput) {
    return new PasskeyChallengeList({
      ...this.filter,
      NOT: filter,
    })
  }
}
