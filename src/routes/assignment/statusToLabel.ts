import type { Assignment, AssignmentStatus } from "@prisma/client"

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

export type Label = typeof Label[keyof typeof Label]

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

export const Color = {
  Red: 0,
  Yellow: 1,
  Green: 2,
  Purple: 3,
} as const

export type Color = typeof Color[keyof typeof Color]

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

/**
 * This record is ordered by how teachers show see assignments. Things near the
 * top of the list will grab a teacher's attention more, so they should be the
 * important tasks. Things near the bottom should be less important.
 */
const labelToSortPrecedenceRecord: Record<Label, number> = {
  // Missing and overdue work should be talked about with students ASAP, so it
  // is at the very top of this list.
  [Label.Missing]: 1,
  [Label.Overdue]: 2,

  // Completed work is ready to be graded, so it should be next in a teacher's
  // queue. We'll organize this subsection by quality of work, helping students
  // who submit attachments and a description, and forcing those who turned in
  // work late to the bottom of the queue.
  [Label.Submitted]: 3,
  [Label.Completed]: 4,
  [Label.Late]: 5,

  // In progress and to do work can't be graded, but isn't invalid in any way.
  // These assignments will go in the middle of the queue, as graded work will
  // always be at the bottom.
  [Label.InProgress]: 6,
  [Label.ToDo]: 7,

  // Work that has already been graded should be moved out of the way to make
  // room for new and more important tasks.
  [Label.Graded]: 8,
}

export function labelToSortPrecedence(label: Label) {
  return labelToSortPrecedenceRecord[label]
}
