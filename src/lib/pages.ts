import {
  faBarsProgress,
  faBookOpen,
  faGear,
  faNoteSticky,
  faTasks,
  faUserGroup,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

export type Creatable =
  | "assignment"
  | "bulletin"
  | "card-deck"
  | "discussion"
  | "group"
  | "resource"
  | "account"

export interface CreateInfo {
  readonly title: string
  readonly type: Creatable
}

export type Searchable =
  | "assignment"
  | "card-deck"
  | "discussion"
  | "group"
  | "resource"

export interface SearchInfo {
  readonly title: string
  readonly type: Searchable
}

export type Overviewable =
  | "assignment"
  | "card-deck"
  | "directory"
  | "discussion"
  | "group"
  | "progress"
  | "resource"
  | "search"
  | "setting"

export interface OverviewInfo {
  readonly href: `/${string}`
  readonly title: string
  readonly type: Overviewable
}

export interface Page {
  readonly color: "red" | "orange" | "yellow" | "green" | "blue" | "purple"
  readonly icon: IconDefinition
  readonly create?: CreateInfo
  readonly overview?: OverviewInfo
  readonly search?: SearchInfo
}

export const pages: readonly Page[] = [
  {
    color: "yellow",
    icon: faNoteSticky,
    create: { title: "Bulletin", type: "bulletin" },
  },
  {
    color: "yellow",
    icon: faBarsProgress,
    overview: {
      href: "/progress",
      title: "Progress",
      type: "progress",
    },
  },
  {
    color: "red",
    icon: faTasks,
    create: { title: "Assignment", type: "assignment" },
    overview: {
      href: "/search?range=week&type=assignment",
      title: "Assignments",
      type: "assignment",
    },
    search: { title: "Assignment", type: "assignment" },
  },
  {
    color: "blue",
    icon: faUserGroup,
    create: { title: "Group", type: "group" },
    overview: {
      href: "/search?range=week&type=group",
      title: "Groups",
      type: "group",
    },
    search: { title: "Group", type: "group" },
  },
  {
    color: "green",
    icon: faBookOpen,
    create: { title: "Resource", type: "resource" },
    overview: {
      href: "/search?range=week&type=resource",
      title: "Resources",
      type: "resource",
    },
    search: { title: "Resource", type: "resource" },
  },
  {
    color: "orange",
    icon: faUserGroup,
    create: { title: "Account", type: "account" },
    overview: { href: "/directory", title: "Directory", type: "directory" },
  },
  {
    color: "purple",
    icon: faGear,
    overview: { href: "/settings", title: "Settings", type: "setting" },
  },
  // News, Schedule, Export
]

export const creatable = pages.filter(
  (page): page is typeof page & { create: {} } => !!page.create
)

export const searchable = pages.filter(
  (page): page is typeof page & { search: {} } => !!page.search
)

export const overviewable = pages.filter(
  (page): page is typeof page & { overview: {} } => !!page.overview
)

export function getPage(type: Overviewable): Page | undefined {
  return pages.find((page) => page.overview?.type == type)
}
