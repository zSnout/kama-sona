import { PrismaClient } from "@prisma/client"
import { error, ok, type Result } from "../result"

const prisma = new PrismaClient()
await prisma.$connect()

/** The type of Prisma Client exposed to queries. */
export type PartialPrismaClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$runCommandRaw" | "$use"
>

/**
 * Calls a database query safely. If the query returns `null` or `undefined`, a
 * {@link defaultValue default value} will be returned instead of the nullish value.
 * Additionally, thrown exceptions are converted into errored {@link Result Results}.
 */
export async function query<T extends {}>(
  fn: (
    database: PartialPrismaClient
  ) => T | PromiseLike<T | null | undefined> | null | undefined,
  defaultValue: Result<T> = error("No items were found in the database.")
): Promise<Result<T>> {
  try {
    const output = await fn(prisma)

    if (output == null) {
      return defaultValue
    }

    return ok(output)
  } catch (err) {
    if (err == null) {
      return defaultValue
    }

    if (err instanceof Error) {
      return error(err.message)
    }

    return error(String(err))
  }
}
