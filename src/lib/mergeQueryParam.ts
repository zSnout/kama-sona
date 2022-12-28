/** Sets a query parameter on a URL and keeps the rest of the URL the same. */
export function mergeQueryParam(url: URL, key: string, value: string) {
  url = new URL(url.href)

  if (value) {
    url.searchParams.set(key, value)
  } else {
    url.searchParams.delete(key)
  }

  return url.href
}
