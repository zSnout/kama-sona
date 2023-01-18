// https://stackoverflow.com/a/2450976
export function shuffle<T>(array: readonly T[]): T[] {
  const copy = [...array]

  let currentIndex = copy.length
  let randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex]!,
      copy[currentIndex]!,
    ]
  }

  return copy
}
