import type { Assignment, AssignmentStatus } from "@prisma/client"

export function statusToLabel(
  status: AssignmentStatus,
  assignment: Assignment
) {
  return status.missing
    ? Label.Missing
    : status.submitted
    ? status.score != null && assignment.points != 0
      ? Label.Graded
      : status.due < status.submitted
      ? Label.Late
      : status.attachments.length > 0 || status.body.trim()
      ? Label.Submitted
      : Label.Completed
    : new Date() > status.due
    ? Label.Overdue
    : status.attachments.length > 0 || status.body.trim()
    ? Label.InProgress
    : Label.ToDo
}

export function statusToColor(
  status: AssignmentStatus,
  assignment: Assignment
) {
  const label = statusToLabel(status, assignment)

  return label == Label.Missing || label == Label.Overdue
    ? Color.Red
    : label == Label.ToDo
    ? Color.Purple
    : label == Label.InProgress || label == Label.Late
    ? Color.Yellow
    : Color.Green
}

export const Color = {
  Red: 0,
  Yellow: 1,
  Green: 2,
  Purple: 3,
} as const

export const Label = {
  Completed: "Completed",
  Graded: "Graded",
  InProgress: "In Progress",
  Late: "Late",
  Missing: "Missing",
  Overdue: "Overdue",
  Submitted: "Submitted",
  ToDo: "To Do",
} as const
