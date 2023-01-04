<script lang="ts" context="module">
  export type SelectItemOrText = string | SelectItem

  export interface SelectItem {
    readonly label: string
    readonly value: string
  }
</script>

<script lang="ts">
  import { browser } from "$app/environment"
  import Checkbox from "./Checkbox.svelte"
  import { search } from "fast-fuzzy"

  export let required = false
  export let name: string | undefined = undefined
  export let options: readonly SelectItemOrText[] = []
  export let values: string[] = []
  export let items: SelectItem[] = []
  export let searchLabel = "Search..."
  export let strictHeight = false

  $: mappedItems = options.map((item) =>
    typeof item == "string" ? { label: item, value: item } : item
  )

  $: asItems = query
    ? search(query, mappedItems, {
        keySelector: (item) => item.label,
      })
    : mappedItems

  $: valueToLabelMap = Object.fromEntries(
    asItems.map((item) => [item.value, item.label])
  )

  $: items = values.map((value) => ({
    value,
    label: valueToLabelMap[value] || "",
  }))

  let query = ""
</script>

<select
  class="field h-48"
  class:sr-only={browser}
  {required}
  multiple
  {name}
  bind:value={values}
>
  {#each mappedItems as option (option.value)}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
</select>

<div
  class="field overflow-y-scroll"
  class:hidden={!browser}
  class:h-48={strictHeight || mappedItems.length > 7}
  aria-hidden="true"
>
  {#if mappedItems.length > 7}
    <div
      class="sticky -top-2 -mx-3 -mt-2 mb-2 flex w-[calc(100%_+_1.5rem)] items-center border-b border-gray-300 bg-white transition focus-within:border-blue-500 dark:border-slate-600 dark:bg-slate-850 dark:focus-within:border-blue-500"
    >
      <input
        class="flex-1 border-0 border-gray-300 bg-transparent transition focus-visible:border-blue-500 focus-visible:ring-0 dark:border-slate-600 dark:focus-visible:border-blue-500"
        class:border-r={values.length > 0}
        type="search"
        placeholder={searchLabel}
        bind:value={query}
        on:keydown={(event) => {
          if (event.key == "Enter") {
            event.preventDefault()

            const value = asItems[0]?.value
            if (value == null) {
              return
            }

            if (values.includes(value)) {
              values.splice(values.indexOf(value), 1)
            } else {
              values.push(value)
            }

            values = values
          }
        }}
      />

      {#if values.length > 0}
        <p class="w-10 text-center">
          {values.length}
          <span class="sr-only"
            >item{values.length == 1 ? "" : "s"} selected</span
          >
        </p>
      {/if}
    </div>
  {/if}

  {#each asItems as option (option.value)}
    <Checkbox
      action={() => {
        if (values.includes(option.value)) {
          values.splice(values.indexOf(option.value), 1)
        } else {
          values.push(option.value)
        }

        values = values
      }}
      checked={values.includes(option.value)}
      tabindex={-1}
    >
      {option.label}
    </Checkbox>
  {:else}
    <p class="max-w-[300px] m-auto text-center">
      It looks like there isn't anything to pick from.
      {#if query}Try changing your search query.{/if}
    </p>
  {/each}
</div>