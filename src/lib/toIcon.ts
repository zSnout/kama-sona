import {
  faCss3,
  faGithub,
  faGoogle,
  faGoogleDrive,
  faHtml5,
  faJs,
  faMarkdown,
  faSass,
  faStackExchange,
  faStackOverflow,
  faYoutube,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons"
import {
  faBookOpen,
  faComments,
  faFile,
  faFileLines,
  faFilePowerpoint,
  faFileText,
  faFont,
  faImage,
  faLayerGroup,
  faLink,
  faMapLocationDot,
  faMicrophone,
  faTable,
  faTableList,
  faTasks,
  faUserGroup,
  faVideo,
  faZ,
} from "@fortawesome/free-solid-svg-icons"
import type { Searchable } from "./pages"

/** Converts a link to its corresponding Font Awesome icon. */
export function linkToIcon(href: string | URL): IconDefinition {
  if (typeof href == "string") {
    try {
      href = new URL(href)
    } catch {
      return faLink
    }
  }

  return href.hostname.includes("docs.google.com")
    ? href.pathname.startsWith("/document")
      ? faFileLines
      : href.pathname.startsWith("/presentation")
      ? faFilePowerpoint
      : href.pathname.startsWith("/spreadsheets")
      ? faTable
      : href.pathname.startsWith("/forms")
      ? faTableList
      : faGoogleDrive
    : href.hostname.includes("maps.google.com")
    ? faMapLocationDot
    : href.hostname.includes("google.com")
    ? faGoogle
    : href.hostname.includes("youtube.com")
    ? faYoutube
    : href.hostname.includes("stackoverflow.com")
    ? faStackOverflow
    : href.hostname.includes("stackexchange.com")
    ? faStackExchange
    : href.hostname.includes("github.com")
    ? faGithub
    : href.hostname.includes("zsnout.com")
    ? faZ
    : faLink
}

/** Converts a file type to its corresponding Font Awesome icon. */
export function fileToIcon(type: string): IconDefinition {
  const endsWith = (extension: string) => type.endsWith(extension)

  return type == "text/plain" || type == "" || endsWith(".txt")
    ? faFileText
    : type == "text/markdown" || endsWith(".md") || endsWith(".markdown")
    ? faMarkdown
    : type == "text/html" || endsWith(".html")
    ? faHtml5
    : type == "text/json" || type == "application/json" || endsWith(".json")
    ? faJs
    : type == "text/javascript" ||
      endsWith(".js") ||
      endsWith(".cjs") ||
      endsWith(".mjs") ||
      type == "text/typescript" ||
      endsWith(".ts") ||
      endsWith(".cts") ||
      endsWith(".mts")
    ? faJs
    : type == "text/css" || endsWith(".css")
    ? faCss3
    : type == "text/sass" ||
      type == "text/scss" ||
      endsWith(".sass") ||
      endsWith(".scss")
    ? faSass
    : type.startsWith("image/") ||
      endsWith(".png") ||
      endsWith(".jpg") ||
      endsWith(".jpeg") ||
      endsWith(".webp") ||
      endsWith(".svg") ||
      endsWith(".gif")
    ? faImage
    : type.startsWith("video/") || endsWith(".mp4")
    ? faVideo
    : type.startsWith("audio/") || endsWith(".mp3") || endsWith(".wav")
    ? faMicrophone
    : type.startsWith("font/")
    ? faFont
    : faFile
}

/** Converts a search item type to its corresponding Font Awesome icon. */
export function itemToIcon(type: Searchable) {
  return type == "assignment"
    ? faTasks
    : type == "resource"
    ? faBookOpen
    : type == "discussion"
    ? faComments
    : type == "group"
    ? faUserGroup
    : type == "card-deck"
    ? faLayerGroup
    : faLink
}
