import { unwrapOr500 } from "$lib/result"
import { query } from "$lib/server/database"
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ locals: { account } }) => {
  const rawGroups = unwrapOr500(
    await query((database) =>
      database.account
        .findUniqueOrThrow({ where: { id: account.id } })
        .memberOf({
          select: {
            id: true,
            title: true,
            assignments: {
              select: {
                id: true,
                points: true,
                title: true,
                category: {
                  select: {
                    id: true,
                    title: true,
                    weight: true,
                  },
                },
                statuses: {
                  where: { assigneeId: account.id },
                  select: {
                    attachments: true,
                    body: true,
                    due: true,
                    exempt: true,
                    id: true,
                    missing: true,
                    score: true,
                    submitted: true,
                    teacherComment: true,
                  },
                },
              },
              orderBy: {
                viewableAfter: "asc",
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        })
    )
  )

  const groups = rawGroups
    .map((group) => {
      const assignments = group.assignments.flatMap((assignment) => {
        const status = assignment.statuses[0]

        if (!status) {
          return []
        }

        return {
          id: assignment.id,
          title: assignment.title,
          points: assignment.points,
          weight: assignment.category.weight,
          category: assignment.category.title,
          status,
        }
      })

      const totalPoints = assignments.reduce(
        (a, b) => (b.status.score == null ? a : a + b.points * b.weight),
        0
      )

      const totalScore = assignments.reduce(
        (a, b) => (b.status.score == null ? a : a + b.status.score * b.weight),
        0
      )

      return {
        grade: {
          score: totalScore,
          points: totalPoints,
          ratio: totalScore / totalPoints,
        },
        id: group.id,
        title: group.title,
        assignments,
      }
    })
    .sort((a, b) => +(a.grade.points == 0) - +(b.grade.points == 0))

  return { groups }
}) satisfies LayoutServerLoad
