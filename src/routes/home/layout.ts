import { writable } from "svelte-local-storage-store"

export const featureNames = [
  "Clock",
  "Note",
  "OtherApps",
  "QuickActions",
  "Todo",
] as const

export type FeatureName = (typeof featureNames)[number]

export type Feature = {
  readonly name: FeatureName
  readonly startX: 1 | 2 | 3
  readonly endX: 1 | 2 | 3
  readonly startY: 1 | 2 | 3 | 4
  readonly endY: 1 | 2 | 3 | 4
}

export type Layout = readonly Feature[]

const defaultLayout: Layout = [
  {
    name: "Clock",
    startX: 2,
    endX: 2,
    startY: 2,
    endY: 2,
  },
  {
    name: "QuickActions",
    startX: 2,
    endX: 2,
    startY: 3,
    endY: 3,
  },
  {
    name: "OtherApps",
    startX: 2,
    endX: 2,
    startY: 4,
    endY: 4,
  },
  {
    name: "Note",
    startX: 1,
    endX: 1,
    startY: 2,
    endY: 3,
  },
  {
    name: "Todo",
    startX: 3,
    endX: 3,
    startY: 2,
    endY: 3,
  },
]

export const layout = writable<Layout>("layout", defaultLayout, {
  serializer: {
    parse(text) {
      try {
        const value: unknown = JSON.parse(text)

        if (Array.isArray(value)) {
          const items = (value as unknown[]).filter(
            (item): item is Feature =>
              typeof item == "object" &&
              item != null &&
              "name" in item &&
              typeof item.name == "string" &&
              featureNames.includes(item.name as any) &&
              "startX" in item &&
              (item.startX === 1 || item.startX === 2 || item.startX === 3) &&
              "endX" in item &&
              (item.endX === 1 || item.endX === 2 || item.endX === 3) &&
              "startY" in item &&
              (item.startY === 1 ||
                item.startY === 2 ||
                item.startY === 3 ||
                item.startY === 4) &&
              "endY" in item &&
              (item.endY === 1 ||
                item.endY === 2 ||
                item.endY === 3 ||
                item.endY === 4)
          )

          if (items.length == 0) {
            return defaultLayout
          }

          return items
        } else {
          return defaultLayout
        }
      } catch {
        return defaultLayout
      }
    },
    stringify: JSON.stringify,
  },
})
