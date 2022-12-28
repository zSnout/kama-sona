/**
 * Converts a date to either "month day" or "month day year" format depending on
 * the current day.
 */
export function toDateString(
  date: Date,
  { short = false, local = false } = {}
) {
  const now = new Date()

  if (local) {
    date = new Date(date)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  }

  const isThisYear =
    // If the months are the same, the dates must have the same year.
    date.getMonth() == now.getMonth()
      ? date.getFullYear() == now.getFullYear()
      : // If the month is later than today, the year should be the same.
      date.getMonth() > now.getMonth()
      ? date.getFullYear() == now.getFullYear()
      : // If the month is before today, the year should be next year.
      date.getMonth() < now.getMonth()
      ? date.getFullYear() == now.getFullYear() + 1
      : false

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: short ? "short" : "long",
    year: isThisYear ? undefined : "numeric",
  })
}

/**
 * Converts a date to either "month" or "month year" format depending on when it occurs.
 */
export function toMonthString(date: Date) {
  const now = new Date()

  const isThisYear =
    // The month must be later in the year and in the same year.
    date.getMonth() >= now.getMonth() && date.getFullYear() == now.getFullYear()

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: isThisYear ? undefined : "numeric",
  })
}
