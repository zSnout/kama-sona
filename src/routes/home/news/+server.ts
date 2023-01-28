import { unwrapOr500 } from "$lib/result"
import { Activity } from "$lib/server/activity"
import { AssignmentStatusList } from "$lib/server/assignment-status"
import { query } from "$lib/server/database"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export type NewsItem = {
  color: "red" | "orange" | "yellow" | "green" | "blue" | "purple"
  title: string
  href: "activity" | (string & {})
}

export const GET = (async ({ locals: { account } }) => {
  const results = await Promise.allSettled<Promise<NewsItem[]>[]>([
    (async () => {
      const passkeys = unwrapOr500(
        await query((database) =>
          database.passkey.aggregate({
            where: { account: account.filter },
            _count: true,
          })
        )
      )

      if (passkeys._count == 0) {
        return [
          {
            color: "purple",
            href: "/settings",
            title: "Create a passkey for faster login",
          },
        ]
      }

      return []
    })(),

    (async () => {
      const missing = unwrapOr500(
        await new AssignmentStatusList({
          assignee: account.filter,
          missing: true,
        }).select({
          assignment: { select: { title: true } },
          id: true,
        })
      )

      const output: NewsItem[] = []

      for (const {
        assignment: { title },
        id,
      } of missing) {
        output.push({
          color: "red",
          href: "/assignment/" + id,
          title: "Missing assignment: " + title,
        })
      }

      return output
    })(),

    (async () => {
      const myId = unwrapOr500(await account.id())

      const activity = unwrapOr500(await Activity.today())

      const contributions = unwrapOr500(
        await activity.select({
          title: true,
          options: {
            select: {
              votes: true,
            },
          },
          comments: {
            where: {
              authorId: myId,
            },
          },
        })
      )

      if (contributions.options.length) {
        if (contributions.options.some((x) => x.votes.includes(myId))) {
          return []
        } else {
          return [
            {
              color: "yellow",
              href: "activity",
              title: "Vote: " + contributions.title,
            },
          ]
        }
      }

      if (contributions.comments.length) {
        return []
      }

      return [
        {
          color: "yellow",
          href: "activity",
          title: "Respond: " + contributions.title,
        },
      ]
    })(),
  ])

  const items = results.flatMap((result) =>
    result.status == "fulfilled" ? result.value : []
  )

  return json(items)
}) satisfies RequestHandler
