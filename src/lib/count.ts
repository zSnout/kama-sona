export function count<T>(array: readonly T[], filter: (item: T) => boolean) {
  return array.reduce((count, value) => count + +filter(value), 0)
}
