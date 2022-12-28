/** Returns `true` the filter is either empty or has the {@link item}. */
export function matchesFilter<T>(item: T, filter: Set<T>): boolean

/** Returns `true` the filter is either empty or has {@link item}.{@link key}. */
export function matchesFilter<T, K extends keyof T & string>(
  item: T,
  filter: Set<T[K]>,
  key: K
): boolean

export function matchesFilter(
  item: any,
  filter: Set<any>,
  key?: string
): boolean {
  if (filter.size == 0) {
    return true
  }

  if (key != null) {
    item = item[key]
  }

  return filter.has(item)
}
