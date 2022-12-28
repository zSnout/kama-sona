import {
  faTasks,
  faUserGroup,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

export type Creatable = "assignment" | "group"

export interface CreateInfo {
  readonly type: Creatable
  readonly singular: string
}

export type Searchable = "assignment" | "group"

export interface SearchInfo {
  readonly type: Searchable
}

export type PageType = "assignment" | "group"

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
    href: "/search?type=assignment",
    icon: faTasks,
    title: "Assignments",
    search: { type: "assignment" },
    type: "assignment",
  },
  {
    create: { singular: "Group", type: "group" },
    color: "blue",
    href: "/search?type=group",
    icon: faUserGroup,
    title: "Groups",
    search: { type: "group" },
    type: "group",
  },
  // Progress
  // Resource
  // Discussion
  // Schedule
  // Export
  // Settings
  // News
]

export function getPage(type: PageType): Page | undefined {
  return pages.find((page) => page.type == type)
}
