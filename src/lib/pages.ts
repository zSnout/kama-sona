import {
  faBarsProgress,
  faBookOpen,
  faGear,
  faTasks,
  faUserGroup,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

export type Creatable =
  | "assignment"
  | "card-deck"
  | "discussion"
  | "group"
  | "resource"

export interface CreateInfo {
  readonly type: Creatable
  readonly singular: string
}

export type Searchable =
  | "assignment"
  | "card-deck"
  | "discussion"
  | "group"
  | "resource"

export interface SearchInfo {
  readonly type: Searchable
}

export type PageType =
  | "assignment"
  | "card-deck"
  | "discussion"
  | "group"
  | "progress"
  | "resource"
  | "search"
  | "setting"

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
    color: "yellow",
    href: "/progress",
    icon: faBarsProgress,
    title: "Progress",
    type: "progress",
  },
  {
    create: { singular: "Assignment", type: "assignment" },
    color: "red",
    href: "/search?range=week&type=assignment",
    icon: faTasks,
    title: "Assignments",
    type: "assignment",
    search: { type: "assignment" },
  },
  {
    create: { singular: "Group", type: "group" },
    color: "blue",
    href: "/search?range=week&type=group",
    icon: faUserGroup,
    title: "Groups",
    type: "group",
    search: { type: "group" },
  },
  {
    create: { singular: "Resource", type: "resource" },
    color: "green",
    href: "/search?range=week&type=resource",
    icon: faBookOpen,
    title: "Resources",
    type: "resource",
    search: { type: "resource" },
  },
  // {
  //   create: { singular: "Card Deck", type: "card-deck" },
  //   color: "orange",
  //   href: "/search?range=week&type=card-deck",
  //   icon: faLayerGroup,
  //   title: "Card Decks",
  //   type: "card-deck",
  //   search: { type: "card-deck" },
  // },
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
  {
    color: "purple",
    href: "/settings",
    icon: faGear,
    title: "Settings",
    type: "setting",
  },
  // News
]

export function getPage(type: PageType): Page | undefined {
  return pages.find((page) => page.type == type)
}
