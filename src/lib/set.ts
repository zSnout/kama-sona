export function intersect<T>(items: readonly (readonly T[])[]): T[] {
  if (items.length == 0) {
    return []
  }

  return items.reduce((a, b) => a.filter((x) => b.includes(x))).slice()
}

export function union<T>(items: readonly (readonly T[])[]): T[] {
  if (items.length == 0) {
    return []
  }

  return [...new Set(items.reduce((a, b) => [...a, ...b]))]
}

export function exclude<T>(items: readonly T[], excluded: readonly T[]): T[] {
  return items.filter((x) => !excluded.includes(x))
}
