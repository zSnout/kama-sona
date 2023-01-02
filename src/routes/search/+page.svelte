<script lang="ts">
  import { browser } from "$app/environment"
  import { page } from "$app/stores"
  import Filter from "$lib/Filter.svelte"
  import FilterList from "$lib/FilterList.svelte"
  import Icon from "$lib/Icon.svelte"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import { mergeQueryParam } from "$lib/mergeQueryParam"
  import { getPage, pages, type Searchable } from "$lib/pages"
  import { toDateString, toMonthString } from "$lib/toDateString"
  import { itemToIcon } from "$lib/toIcon"
  import type { IconDefinition } from "@fortawesome/free-brands-svg-icons"
  import {
    faCalendarCheck,
    faChevronLeft,
    faChevronRight,
    faEye,
    faGear,
    faHashtag,
    faObjectGroup,
    faPeopleGroup,
    faPercent,
  } from "@fortawesome/free-solid-svg-icons"
  import type {
    Assignment,
    AssignmentStatus,
    Category,
    Group,
  } from "@prisma/client"
  import { search } from "fast-fuzzy"
  import type { PageData } from "./$types"

  export let data: PageData

  interface Label {
    readonly content: string | number
    readonly icon: IconDefinition
    readonly title: string
  }

  interface Item {
    readonly category?: string
    readonly date?: readonly [start: Date, end: Date]
    readonly group?: string
    readonly href: string
    readonly isManager: boolean
    readonly labels: readonly Label[]
    readonly title: string
    readonly type: Searchable
  }

  // #region map database contents to `allItems`

  function findGroupThatUserIsMemberOf(groups: Group[]): Group | undefined {
    return groups.find((group) => data.account.memberOfIds.includes(group.id))
  }

  function managedAssignmentToItem(
    assignment: Assignment & {
      category: Category
      groups: Group[]
    }
  ): Item {
    return {
      type: "assignment",
      isManager: true,
      category: assignment.category.title,
      date: [assignment.creation, assignment.due],
      href: `/assignment/manage/${assignment.id}`,
      group: findGroupThatUserIsMemberOf(assignment.groups)?.title,
      title: assignment.title,
      labels: [
        {
          content: toDateString(
            new Date() > assignment.viewableAfter
              ? assignment.due
              : assignment.viewableAfter
          ),
          icon: new Date() > assignment.viewableAfter ? faCalendarCheck : faEye,
          title:
            new Date() > assignment.viewableAfter
              ? "Due date:"
              : "Visible to students after:",
        },
        ...(assignment.points == 0
          ? []
          : [
              {
                content: `${assignment.points} point${
                  assignment.points == 1 ? "" : "s"
                }`,
                icon: faPercent,
                title: "Points:",
              },
            ]),
      ],
    }
  }

  function assignmentStatusToItem(
    status: AssignmentStatus & {
      assignment: Assignment & {
        category: Category
        groups: Group[]
      }
    }
  ): Item {
    return {
      type: "assignment",
      isManager: false,
      date: [status.assignment.viewableAfter, status.assignment.due],
      href: `/assignment/${status.id}`,
      group: findGroupThatUserIsMemberOf(status.assignment.groups)?.title,
      labels: [
        {
          content: toDateString(status.due),
          icon: faCalendarCheck,
          title: "Due date:",
        },
        ...(status.assignment.points == 0
          ? []
          : [
              {
                content: `${status.assignment.points} point${
                  status.assignment.points == 1 ? "" : "s"
                }`,
                icon: faPercent,
                title: "Points:",
              },
            ]),
      ],
      title: status.assignment.title,
      category: status.assignment.category.title,
    }
  }

  function groupToItem(group: Group): Item {
    const isManager = group.managerIds.includes(data.account.id)

    return {
      type: "group",
      isManager,
      href: `/group/${group.id}`,
      labels: [
        {
          content: `${group.memberIds.length} member${
            group.memberIds.length == 1 ? "" : "s"
          }`,
          icon: faHashtag,
          title: "Number of members:",
        },
      ],
      title: group.title,
    }
  }

  $: allItems = [
    ...data.assignedAssignments.map(assignmentStatusToItem),
    ...data.managedAssignments.map(managedAssignmentToItem),
    ...data.groups.map(groupToItem),
  ]
    .sort((a, b) => (a.title == b.title ? 0 : a.title < b.title ? -1 : 1))
    .sort((a, b) => (a.title == b.title ? 0 : a.title < b.title ? -1 : 1))

  // #endregion
  // #region filter by date

  const dayLength = 24 * 60 * 60 * 1000

  let rangeFromURL = $page.url.searchParams.get("range")

  let rangeFilterObject = {
    day: rangeFromURL == "day",
    week: rangeFromURL == "week",
    month: rangeFromURL == "month",
  }

  $: rangeLength = rangeFilterObject.day
    ? dayLength
    : rangeFilterObject.week
    ? 7 * dayLength
    : rangeFilterObject.month
    ? 30 * dayLength
    : undefined

  let dateFromURL = $page.url.searchParams.get("date")

  let rangeCenter =
    dateFromURL && !isNaN(+new Date(dateFromURL))
      ? new Date(dateFromURL)
      : new Date()

  function floorDateByDay(date: Date) {
    date = new Date(date)
    date.setHours(0, 0, 0, 0)
    return date
  }

  function floorDateByWeek(date: Date) {
    date = floorDateByDay(date)
    date.setDate(date.getDate() - date.getDay())
    return date
  }

  function floorDateByMonth(date: Date) {
    date = floorDateByDay(date)
    date.setDate(1)
    return date
  }

  $: floorDate = rangeFilterObject.day
    ? floorDateByDay
    : rangeFilterObject.week
    ? floorDateByWeek
    : rangeFilterObject.month
    ? floorDateByMonth
    : undefined

  $: itemsFilteredByDate = floorDate
    ? allItems.filter((item) => {
        if (!item.date) {
          return false
        }

        const [start, end] = item.date

        return (
          floorDate!(start) <= floorDate!(rangeCenter) &&
          floorDate!(rangeCenter) <= floorDate!(end)
        )
      })
    : allItems

  $: isRangeCenterToday =
    +floorDateByDay(rangeCenter) == +floorDateByDay(new Date())

  // #endregion
  // #region filter by type (assignment, resource, etc.)

  let type = $page.url.searchParams.get("type") || ""

  let itemTypeFilter: Record<Searchable, boolean> = {
    assignment: type.includes("assignment"),
    group: type.includes("group"),
  }

  $: numberOfItemTypesSelected =
    +itemTypeFilter.assignment + +itemTypeFilter.group

  $: itemsFilteredByType =
    numberOfItemTypesSelected == 0
      ? itemsFilteredByDate
      : itemsFilteredByDate.filter((item) => itemTypeFilter[item.type])

  // #endregion
  // #region filter by whether user manages the object

  let isManager = $page.url.searchParams.get("is-manager")

  let isManagerFilter: Record<`${boolean}` /** Item.isManager */, boolean> = {
    true: isManager == "true",
    false: isManager == "false",
  }

  $: noIsManagerFilterSelected = !(
    isManagerFilter.true || isManagerFilter.false
  )

  $: itemsFilteredByIsManager = noIsManagerFilterSelected
    ? itemsFilteredByType
    : itemsFilteredByType.filter(({ isManager }) =>
        isManagerFilter.true
          ? isManager
          : isManagerFilter.false
          ? !isManager
          : true
      )

  // #endregion
  // #region filter by groups

  let groupFilters: Record<string, boolean> = {}

  $: groupFilterNames = [
    ...new Set(itemsFilteredByIsManager.map((e) => e.group!).filter((e) => e)),
  ].sort((a, b) => a.localeCompare(b, undefined))

  $: selectedFilters = groupFilterNames.filter((name) => groupFilters[name])

  $: itemsFilteredByGroup =
    selectedFilters.length != 0
      ? itemsFilteredByIsManager.filter(({ group }) =>
          selectedFilters.includes(group || "")
        )
      : itemsFilteredByIsManager

  // #endregion
  // #region filter by categories

  let categoryFilters: Record<string, boolean> = {}

  $: categoryFilterNames = [
    ...new Set(itemsFilteredByGroup.map((e) => e.category!).filter((e) => e)),
  ].sort((a, b) => a.localeCompare(b, undefined))

  $: selectedCategoryFilters = categoryFilterNames.filter(
    (name) => categoryFilters[name]
  )

  $: itemsFilteredByCategory =
    selectedCategoryFilters.length != 0
      ? itemsFilteredByGroup.filter(({ category }) =>
          selectedCategoryFilters.includes(category || "")
        )
      : itemsFilteredByGroup

  // #endregion
  // #region filter by search (only active if JS is enabled client-side)

  let query = ""

  $: items =
    browser && query
      ? search(query, itemsFilteredByCategory, {
          keySelector(item: Item) {
            return [
              item.title,
              item.category || "",
              item.group || "",
              ...item.labels.map((label) => "" + label.content),
            ]
          },
        })
      : itemsFilteredByCategory

  let searchEl: HTMLInputElement | undefined
  // #endregion
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key == "/") {
      event.preventDefault()
      searchEl?.focus()
    }
  }}
/>

<div class="mb-2 flex flex-col flex-wrap gap-2 sm:flex-row">
  <div class="md:flex-1">
    <FilterList>
      <Filter param={["range", "day"]} bind:active={rangeFilterObject.day}>
        Day
      </Filter>

      <Filter param={["range", "week"]} bind:active={rangeFilterObject.week}>
        Week
      </Filter>

      <Filter param={["range", "month"]} bind:active={rangeFilterObject.month}>
        Month
      </Filter>
    </FilterList>
  </div>

  {#if rangeLength != null}
    <div class="mx-auto flex">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a
        class="field ml-auto h-8 py-0"
        href={mergeQueryParam(
          $page.url,
          "date",
          new Date(+rangeCenter - rangeLength).toDateString()
        )}
        on:click={() =>
          (rangeCenter = new Date(+rangeCenter - (rangeLength || 0)))}
      >
        <Icon class="h-4 w-4" icon={faChevronLeft} />
      </a>

      <p class="mx-4 place-self-center text-center md:w-64">
        {#if rangeFilterObject.day}
          {toDateString(rangeCenter)}
        {:else if rangeFilterObject.week}
          {toDateString(
            floorDateByDay(
              new Date(rangeCenter.valueOf() - rangeCenter.getDay() * dayLength)
            ),
            { short: true }
          )}<span class="mx-2">–</span>{toDateString(
            floorDateByDay(
              new Date(
                rangeCenter.valueOf() -
                  rangeCenter.getDay() * dayLength +
                  7 * dayLength
              )
            ),
            { short: true }
          )}
        {:else if rangeFilterObject.month}
          {toMonthString(rangeCenter)}
        {/if}
      </p>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a
        class="field h-8 py-0"
        href={mergeQueryParam(
          $page.url,
          "date",
          new Date(+rangeCenter + rangeLength).toDateString()
        )}
        on:click={() =>
          (rangeCenter = new Date(+rangeCenter + (rangeLength || 0)))}
      >
        <Icon class="h-4 w-4" icon={faChevronRight} />
      </a>
    </div>

    <div class="hidden h-8 flex-1 justify-end md:flex">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a
        class="ring-color relative mx-0 flex items-center rounded-full border-gray-300 px-4 py-1 shadow transition focus:outline-none focus-visible:z-10 focus-visible:ring dark:border-slate-600"
        class:bg-white={!isRangeCenterToday}
        class:bg-gray-300={isRangeCenterToday}
        class:dark:bg-slate-700={isRangeCenterToday}
        class:dark:bg-slate-900={!isRangeCenterToday}
        href={mergeQueryParam($page.url, "date", new Date().toDateString())}
        on:click={() => (rangeCenter = new Date())}
      >
        Today
      </a>
    </div>
  {/if}
</div>

<div class="flex flex-wrap gap-4">
  <FilterList class="mr-auto">
    {#each pages as page}
      {#if page.search}
        <Filter
          disabled={!itemsFilteredByDate.some(
            (item) => item.type == page.search?.type
          )}
          param={["type", page.search.type]}
          tooltip={page.title}
          class="text-{page.color}-500 before:mt-1 before:font-semibold"
          bind:active={itemTypeFilter[page.search.type]}
        >
          <Icon class="icon-fill-{page.color} h-5 w-5" icon={page.icon} />
        </Filter>
      {/if}
    {/each}
  </FilterList>

  <FilterList>
    <Filter
      disabled={!itemsFilteredByType.some((item) => item.isManager)}
      param={["is-manager", "true"]}
      bind:active={isManagerFilter.true}
    >
      Manager
    </Filter>

    <Filter
      disabled={!itemsFilteredByType.some((item) => !item.isManager)}
      param={["is-manager", "false"]}
      bind:active={isManagerFilter.false}
    >
      Viewer
    </Filter>
  </FilterList>
</div>

{#if browser}
  <div class="mt-2 flex flex-wrap gap-2">
    {#if groupFilterNames.length > 1}
      <FilterList class="mr-auto">
        {#each groupFilterNames as group (group)}
          <Filter bind:active={groupFilters[group]}>
            {group}
          </Filter>
        {/each}
      </FilterList>
    {/if}

    {#if categoryFilterNames.length > 1}
      <FilterList class="ml-auto hidden md:block">
        {#each categoryFilterNames as category (category)}
          <Filter bind:active={categoryFilters[category]}>
            {category}
          </Filter>
        {/each}
      </FilterList>
    {/if}
  </div>

  <input
    class="field mt-4"
    placeholder="Search your items..."
    type="search"
    bind:value={query}
    bind:this={searchEl}
    on:keydown|stopPropagation={() => {}}
  />
{/if}

{#if items.length != 0}
  <div class="mt-4">
    {#each browser ? items : itemsFilteredByIsManager as item (item.href)}
      <a
        class="ring-color-initial transition-with-[grid-template-columns] grid w-full grid-rows-[auto_auto] gap-x-3 gap-y-1 rounded-lg px-3 py-2 odd:bg-gray-100 even:bg-gray-200 focus:outline-none focus-visible:z-10 focus-visible:-my-[1px] focus-visible:-ml-[1px] focus-visible:w-[calc(100%_+_2px)] focus-visible:border focus-visible:ring dark:odd:bg-slate-800 dark:even:bg-slate-700 {numberOfItemTypesSelected ==
        1
          ? 'grid-cols-[0,minmax(0,1fr),minmax(0,0.5fr)] pl-0 md:grid-cols-[0,minmax(0,1fr),repeat(2,minmax(0,0.5fr))]'
          : 'grid-cols-[2rem,minmax(0,1fr),minmax(0,0.5fr)] pl-3 md:grid-cols-[2rem,minmax(0,1fr),repeat(2,minmax(0,0.5fr))]'} relative"
        href={item.href}
      >
        <Icon
          class="col-start-1 col-end-2 row-start-1 row-end-3 m-auto h-4 w-4 {numberOfItemTypesSelected ==
          1
            ? 'opacity-0'
            : ''} transition icon-fill-{getPage(item.type)?.color}"
          icon={itemToIcon(item.type)}
        />

        <p class="prefer-w-80 col-start-2 col-end-3 row-start-1 row-end-2">
          {item.title}
        </p>

        <IconLabels
          class="prefer-w-80 col-start-2 col-end-3 row-start-2 row-end-3 text-sm font-light text-gray-500 dark:text-slate-400"
        >
          {#if !(isManagerFilter.true || isManagerFilter.false)}
            <p>
              <Icon isLabel icon={item.isManager ? faGear : faEye} />
            </p>
          {/if}

          {#each item.labels as { content, icon, title }}
            <IconLabel {content} {icon} {title} />
          {/each}
        </IconLabels>

        {#if item.category}
          <p
            class="col-start-3 col-end-4 row-start-1 row-end-2 hidden md:block"
          >
            <Icon isLabel icon={faObjectGroup} />
            {item.category}
          </p>
        {/if}

        {#if item.group}
          <p
            class="col-start-3 col-end-4 row-start-1 row-end-2 md:col-start-4 md:col-end-5"
          >
            <Icon isLabel icon={faPeopleGroup} />
            {item.group}
          </p>
        {/if}
      </a>
    {/each}
  </div>
{:else}
  <p class="prefer-w-96 mx-auto flex flex-1 items-center">
    We can't find any items that involve you. Try picking a different set of
    filters.
  </p>
{/if}
