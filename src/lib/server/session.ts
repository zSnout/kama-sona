import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import type { Cookies } from "@sveltejs/kit"
import { AccountList } from "./account"
import { query } from "./database"

/** A {@link Result} to return when no sessions match a given filter. */
export const errorNoSessionExists = error(
  "No session exists that matches the given information."
)

export class Session {
  static async create(data: Pick<Prisma.SessionCreateInput, "for">) {
    const code = crypto.randomUUID()

    if (data.for?.connect) {
      const oldDeleted = await query((database) =>
        database.session.deleteMany({
          where: {
            for: data.for!.connect,
          },
        })
      )

      if (!oldDeleted.ok) {
        return oldDeleted
      }
    }

    const session = await query((database) =>
      database.session.create({
        data: {
          code,
          for: data.for,
        },
      })
    )

    if (!session.ok) {
      return session
    }

    return ok(new Session({ id: session.value.id }))
  }

  static fromCookies(cookies: Cookies) {
    const session = cookies.get("session")

    if (!session) {
      return error("Your session has expired. Please log in again.")
    }

    return ok(new Session({ code: session }))
  }

  constructor(readonly filter: Prisma.SessionWhereUniqueInput) {}

  select<T extends Prisma.SessionSelect>(select: T) {
    return query(
      (database) =>
        database.session.findUniqueOrThrow({ where: this.filter, select }),
      errorNoSessionExists
    )
  }

  update<
    T extends Prisma.SessionUpdateInput,
    U extends Prisma.SessionSelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.session.update({ where: this.filter, data, select }),
      errorNoSessionExists
    )
  }

  account() {
    return new AccountList({ session: this.filter }).first()
  }
}
