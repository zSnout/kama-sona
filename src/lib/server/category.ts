import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { query } from "./database"

/** A {@link Result} to return when no categories match a given filter. */
export const errorNoCategoryExists = error(
  "No category exists that matches the given information."
)

export class Category {
  static async create(
    data: Pick<Prisma.CategoryCreateInput, "title" | "weight">
  ) {
    const category = await query((database) =>
      database.category.create({
        data,
      })
    )

    if (!category.ok) {
      return category
    }

    return ok(new Category({ id: category.value.id }))
  }

  constructor(readonly filter: Prisma.CategoryWhereUniqueInput) {}

  select<T extends Prisma.CategorySelect>(select: T) {
    return query(
      (database) =>
        database.category.findUniqueOrThrow({ where: this.filter, select }),
      errorNoCategoryExists
    )
  }

  update<
    T extends Prisma.CategoryUpdateInput,
    U extends Prisma.CategorySelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.category.update({ where: this.filter, data, select }),
      errorNoCategoryExists
    )
  }
}

export class CategoryList {
  constructor(readonly filter: Prisma.CategoryWhereInput) {}

  count() {
    return query((database) => database.category.count({ where: this.filter }))
  }

  select<T extends Prisma.CategorySelect>(select: T) {
    return query((database) =>
      database.category.findMany({
        select,
        orderBy: { title: "asc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.CategoryUpdateInput>(data: T) {
    return query((database) =>
      database.category.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.CategoryWhereInput) {
    return new CategoryList({
      ...this.filter,
      NOT: filter,
    })
  }
}
