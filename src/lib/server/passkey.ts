import { PUBLIC_KS_APP_BASE, PUBLIC_KS_APP_NAME } from "$env/static/public"
import { error, ok, type Result } from "$lib/result"
import type { Prisma } from "@prisma/client"
import { AccountList } from "./account"
import { query } from "./database"

/** A {@link Result} to return when no passkeys match a given filter. */
export const errorNoPasskeyExists = error(
  "No passkey exists that matches the given information."
)

export const rpName = PUBLIC_KS_APP_NAME
export const rpID = new URL(PUBLIC_KS_APP_BASE).hostname
export const expectedOrigin = new URL(PUBLIC_KS_APP_BASE).origin

export class Passkey {
  static async create(
    data: Pick<
      Prisma.PasskeyCreateInput,
      | "account"
      | "counter"
      | "creation"
      | "credentialBackedUp"
      | "credentialDeviceType"
      | "credentialId"
      | "credentialPublicKey"
      | "label"
      | "transports"
    >
  ) {
    const passkey = await query((database) =>
      database.passkey.create({
        data,
      })
    )

    if (!passkey.ok) {
      return passkey
    }

    return ok(new Passkey({ id: passkey.value.id }))
  }

  constructor(readonly filter: Prisma.PasskeyWhereUniqueInput) {}

  delete() {
    return query(
      (database) => database.passkey.delete({ where: this.filter }),
      errorNoPasskeyExists
    )
  }

  select<T extends Prisma.PasskeySelect>(select: T) {
    return query(
      (database) =>
        database.passkey.findUniqueOrThrow({ where: this.filter, select }),
      errorNoPasskeyExists
    )
  }

  update<
    T extends Prisma.PasskeyUpdateInput,
    U extends Prisma.PasskeySelect = {}
  >(data: T, select?: U) {
    return query(
      (database) =>
        database.passkey.update({ where: this.filter, data, select }),
      errorNoPasskeyExists
    )
  }

  account() {
    return new AccountList({ passkeys: { some: this.filter } }).first()
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

export class PasskeyList {
  constructor(readonly filter: Prisma.PasskeyWhereInput) {}

  count() {
    return query((database) => database.passkey.count({ where: this.filter }))
  }

  select<T extends Prisma.PasskeySelect>(select: T) {
    return query((database) =>
      database.passkey.findMany({
        select,
        orderBy: { creation: "desc" },
        where: this.filter,
      })
    )
  }

  update<T extends Prisma.PasskeyUpdateInput>(data: T) {
    return query((database) =>
      database.passkey.updateMany({ data, where: this.filter })
    )
  }

  not(filter: Prisma.PasskeyWhereInput) {
    return new PasskeyList({
      ...this.filter,
      NOT: filter,
    })
  }
}
