import type { ActivityData, ActivityPost } from "$lib/activity/Activity.svelte"
import { unwrapOr500 } from "$lib/result"
import { Activity, ActivityList } from "$lib/server/activity"
import { transaction } from "$lib/server/database"
import { json as rawJson } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

const json: (data: ActivityData) => Response = rawJson

export const GET = (async ({
  locals: { account },
  myId: _myId,
  activity: _activity,
}: {
  locals: App.Locals
  myId?: string
  activity?: Activity
}) => {
  const myId = _myId || unwrapOr500(await account.id())

  const activity = _activity || unwrapOr500(await Activity.today())

  if (!activity) {
    return json({
      type: "NoActivity",
    } satisfies ActivityData)
  }

  const data = unwrapOr500(
    await activity.select({
      creation: true,
      id: true,
      comments: {
        select: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          body: true,
        },
      },
      options: true,
      title: true,
      type: true,
    })
  )

  if (data.type == "Poll") {
    return json({
      creation: data.creation,
      id: data.id,
      type: "Poll",
      title: data.title,
      comments: data.comments.map(({ author: { id, name }, body }) => ({
        author: name,
        body,
        vote: data.options.find((option) => option.votes.includes(id))?.title,
      })),
      options: data.options.map(({ title, votes }) => ({
        title,
        votes: votes.length,
      })),
      myVote: data.options.find((option) => option.votes.includes(myId))?.title,
    } satisfies ActivityData)
  }

  throw new Error("Unknown activity type.")
}) satisfies RequestHandler

export const POST = (async ({ locals: { account }, request }) => {
  const data: ActivityPost & { id: string } = await request.json()

  const myId = unwrapOr500(await account.id())
  const activity = new Activity({ id: data.id })

  switch (data.type) {
    case "Poll:select":
      unwrapOr500(
        await transaction(async (tx, check) => {
          const { options } = check(
            await tx.activity.findUnique({
              select: { options: true },
              where: { id: data.id },
            })
          )

          check(
            await tx.activity.update({
              data: {
                options: options.map((option) => ({
                  title: option.title,
                  votes:
                    option.title == data.optionTitle
                      ? option.votes.filter((x) => x != myId).concat(myId)
                      : option.votes.filter((x) => x != myId),
                })),
              },
              where: { id: data.id },
            })
          )

          return {}
        })
      )
      break

    case "Poll:comment":
      if (!data.body.trim()) {
        break
      }

      unwrapOr500(
        await activity.update({
          comments: {
            create: {
              body: data.body.slice(0, 10000).trim(),
              authorId: myId,
            },
          },
        })
      )
      break

    case "Archive:retrieve":
      const activities = unwrapOr500(
        await new ActivityList({}).select({
          creation: true,
          id: true,
          title: true,
        })
      )

      return json({
        type: "Archive",
        activities,
      })
  }

  return GET({ locals: { account }, myId, activity })
}) satisfies RequestHandler
