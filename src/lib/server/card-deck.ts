import { error, type Result } from "$lib/result"
import type { CardDeck, Prisma } from "@prisma/client"
import { query } from "./database"

export function create(
  data: Pick<Prisma.CardDeckCreateInput, "manager" | "title">
): Promise<Result<CardDeck>> {
  return query((database) => database.cardDeck.create({ data }))
}

export function get(
  where: Prisma.CardDeckWhereUniqueInput
): Promise<Result<CardDeck>> {
  return query(
    (database) => database.cardDeck.findUnique({ where }),
    error("No card deck found with the given ID.")
  )
}
