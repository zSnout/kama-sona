import { Prisma, PrismaClient } from "@prisma/client"
import { error, ok, type Result } from "../result"

const prisma = new PrismaClient()
prisma.$connect()

/** The type of Prisma Client exposed to queries. */
export type PartialPrismaClient = Omit<PrismaClient, `$${string}`>

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

class ResortToDefaultValue {}

/**
 * Calls a database transaction safely. If the query returns `null` or
 * `undefined`, a {@link defaultValue default value} will be returned instead
 * of the nullish value. Additionally, thrown exceptions are converted into
 * errored {@link Result Results}. A `check` function is also passed to handle
 * intermediate null or undefined values.
 */
export async function transaction<T extends {}>(
  fn: (
    tx: Prisma.TransactionClient,
    check: <T extends {}>(value: T | null | undefined) => T
  ) => T | PromiseLike<T | null | undefined> | null | undefined,
  defaultValue: Result<T> = error("No items were found in the database.")
): Promise<Result<T>> {
  try {
    return await prisma.$transaction<Result<T>>(async (tx) => {
      const output = await fn(tx, (value) => {
        if (value == null) {
          throw new ResortToDefaultValue()
        }

        return value
      })

      if (output == null) {
        return defaultValue
      }

      return ok(output)
    })
  } catch (err) {
    if (err == null || err instanceof ResortToDefaultValue) {
      return defaultValue
    }

    if (err instanceof Error) {
      return error(err.message)
    }

    return error(String(err))
  }
}
