import {
  faBookOpen,
  faComments,
  faTasks,
  faUserGroup,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

export type Creatable = "assignment" | "discussion" | "group" | "resource"

export interface CreateInfo {
  readonly type: Creatable
  readonly singular: string
}

export type Searchable = "assignment" | "discussion" | "group" | "resource"

export interface SearchInfo {
  readonly type: Searchable
}

export type PageType = "assignment" | "discussion" | "group" | "resource"

export interface Page {
  readonly create?: CreateInfo
  readonly color: "red" | "orange" | "yellow" | "green" | "blue" | "purple"
  readonly href: `/${string}`
  readonly icon: IconDefinition
  readonly search?: SearchInfo
  readonly title: string
  readonly type: PageType
}

export const pages: readonly Page[] = [
  {
    create: { singular: "Assignment", type: "assignment" },
    color: "red",
    href: "/search?range=week&type=assignment",
    icon: faTasks,
    title: "Assignments",
    search: { type: "assignment" },
    type: "assignment",
  },
  {
    create: { singular: "Group", type: "group" },
    color: "blue",
    href: "/search?range=week&type=group",
    icon: faUserGroup,
    title: "Groups",
    search: { type: "group" },
    type: "group",
  },
  // Progress
  {
    create: { singular: "Resource", type: "resource" },
    color: "green",
    href: "/search?range=week&type=resource",
    icon: faBookOpen,
    title: "Resources",
    search: { type: "resource" },
    type: "resource",
  },
  // {
  //   create: { singular: "Discussion", type: "discussion" },
  //   color: "purple",
  //   href: "/search?range=week&type=discussion",
  //   icon: faComments,
  //   title: "Discussions",
  //   search: { type: "discussion" },
  //   type: "discussion",
  // },
  // Schedule
  // Export
  // Settings
  // News
]

export function getPage(type: PageType): Page | undefined {
  return pages.find((page) => page.type == type)
}
