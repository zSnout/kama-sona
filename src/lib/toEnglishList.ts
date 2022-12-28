/** Converts a list of items into a comma-delimited list with proper grammar. */
export function toEnglishList(
  items: string[],
  joiner: "and" | "or" | "nor" | (string & {}),
  defaultValue: string
): string {
  if (items.length == 0) {
    return defaultValue
  } else if (items.length == 1) {
    return items[0]!
  } else if (items.length == 2) {
    return `${items[0]} ${joiner} ${items[1]}`
  } else {
    return `${items.slice(0, -1).join(", ")} ${joiner} ${
      items[items.length - 1]
    }`
  }
}
