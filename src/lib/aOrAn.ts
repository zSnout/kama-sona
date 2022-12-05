/** Outputs "a" or "an" depending on the provided next word. */
export function aOrAn(nextWord: string): "a" | "an" {
  const char = nextWord[0].toLowerCase()

  if (char == "a" || char == "e" || char == "i" || char == "o" || char == "u") {
    return "an"
  } else {
    return "a"
  }
}
