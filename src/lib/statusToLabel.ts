import type { Assignment, AssignmentStatus } from "@prisma/client"

export const Label = {
  Completed: "Completed",
  Exempt: "Exempt",
  Graded: "Graded",
  InProgress: "In Progress",
  Late: "Late",
  Overdue: "Overdue",
  Submitted: "Submitted",
  ToDo: "To Do",
} as const

export type Label = (typeof Label)[keyof typeof Label]

export function statusToLabel(
  status: Pick<
    AssignmentStatus,
    "attachments" | "body" | "due" | "exempt" | "score" | "submitted"
  >,
  assignment: Pick<Assignment, "points">
) {
  return status.exempt
    ? Label.Exempt
    : status.submitted
    ? status.score != null && assignment.points != 0
      ? Label.Graded
      : status.due < status.submitted
      ? Label.Late
      : status.attachments.length > 0 ||
        (status.body.trim() && status.body.trim() != "<p></p>")
      ? Label.Submitted
      : Label.Completed
    : new Date() > status.due
    ? Label.Overdue
    : status.attachments.length > 0 ||
      (status.body.trim() && status.body.trim() != "<p></p>")
    ? Label.InProgress
    : Label.ToDo
}

export const Color = {
  Red: 0,
  Yellow: 1,
  Green: 2,
  Purple: 3,
} as const

export type Color = (typeof Color)[keyof typeof Color]

export function statusToColor(
  status: Pick<AssignmentStatus, "due" | "exempt" | "score" | "submitted">,
  assignment: Pick<Assignment, "points">
) {
  return status.exempt
    ? Color.Green
    : status.submitted
    ? status.score != null && assignment.points != 0
      ? Color.Green
      : status.due < status.submitted
      ? Color.Yellow
      : Color.Green
    : new Date() > status.due
    ? Color.Red
    : Color.Purple
}

/**
 * This record is ordered by how teachers show see assignments. Things near the
 * top of the list will grab a teacher's attention more, so they should be the
 * important tasks. Things near the bottom should be less important.
 */
const labelToSortPrecedenceRecord: Record<Label, number> = {
  // Completed work is ready to be graded, so it should be next in a teacher's
  // queue. We'll organize this subsection by quality of work, helping students
  // who submit attachments and a description, and forcing those who turned in
  // work late to the bottom of the queue.
  [Label.Submitted]: 1,
  [Label.Completed]: 2,
  [Label.Late]: 3,

  // Overdue work is also important, so let's put it between completed and
  // incomplete work.
  [Label.Overdue]: 4,

  // In progress and to do work can't be graded, but isn't invalid in any way.
  // These assignments will go in the middle of the queue, as graded work will
  // always be at the bottom.
  [Label.InProgress]: 5,
  [Label.ToDo]: 6,

  // We'll also stuff exempt work here, as it doesn't need to be thought about
  // often.
  [Label.Exempt]: 7,

  // Work that has already been graded should be moved out of the way to make
  // room for new and more important tasks.
  [Label.Graded]: 8,
}

export function labelToSortPrecedence(label: Label) {
  return labelToSortPrecedenceRecord[label]
}
