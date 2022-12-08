import type { Prisma, Session } from "@prisma/client"
import { error, type Result } from "../result"
import { query } from "./database"

export const errorNoSessionExists = error("Looks like you've been logged out!")

/** Gets information about a session. */
export function get(
  filter: Prisma.SessionWhereUniqueInput
): Promise<Result<Session>> {
  return query(
    (database) => database.session.findUnique({ where: filter }),
    errorNoSessionExists
  )
}
