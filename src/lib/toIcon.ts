import {
  faGithub,
  faGoogle,
  faGoogleDrive,
  faHtml5,
  faJs,
  faMarkdown,
  faStackExchange,
  faStackOverflow,
  faYoutube,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons"
import {
  faFile,
  faFileLines,
  faFilePowerpoint,
  faFileText,
  faFont,
  faImage,
  faLink,
  faMapLocationDot,
  faMicrophone,
  faTable,
  faTableList,
  faVideo,
  faZ,
} from "@fortawesome/free-solid-svg-icons"

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
  return type == "text/plain" || type == ""
    ? faFileText
    : type == "text/markdown"
    ? faMarkdown
    : type == "text/html"
    ? faHtml5
    : type == "text/json" || type == "application/json"
    ? faJs
    : type == "text/javascript"
    ? faJs
    : type == "text/typescript"
    ? faJs
    : type == "text/css"
    ? faJs
    : type == "text/css"
    ? faJs
    : type.startsWith("image/")
    ? faImage
    : type.startsWith("video/")
    ? faVideo
    : type.startsWith("audio/")
    ? faMicrophone
    : type.startsWith("font/")
    ? faFont
    : faFile
}
