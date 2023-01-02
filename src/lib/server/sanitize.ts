import sanitizeHtml from "sanitize-html"

/** An opinionated HTML sanitizer. */
export function sanitize(html: string) {
  return sanitizeHtml(html)
}
