<script lang="ts">
  import { browser } from "$app/environment"
  import { page } from "$app/stores"
  import Filter from "$lib/Filter.svelte"
  import FilterList from "$lib/FilterList.svelte"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import { mergeQueryParam } from "$lib/mergeQueryParam"
  import MultiSelect from "$lib/MultiSelect.svelte"
  import { getPage, pages, type Searchable } from "$lib/pages"
  import Table from "$lib/Table.svelte"
  import Title from "$lib/Title.svelte"
  import { toDateString, toMonthString } from "$lib/toDateString"
  import { itemToIcon } from "$lib/toIcon"
  import type { IconDefinition } from "@fortawesome/free-brands-svg-icons"
  import {
    faArrowUp,
    faBookOpen,
    faCalendar,
    faCalendarCheck,
    faChevronLeft,
    faChevronRight,
    faEye,
    faGear,
    faHashtag,
    faObjectGroup,
    faPeopleGroup,
    faPercent,
    faTasks,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import { search } from "fast-fuzzy"
  import { writable } from "svelte-local-storage-store"
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

  function findGroupThatUserIsMemberOf<T extends { id: string }>(
    groups: T[]
  ): T | undefined {
    return groups.find((group) => data.account.memberOfIds.includes(group.id))
  }

  function managedAssignmentToItem(assignment: {
    category: { title: string }
    creation: Date
    due: Date
    id: string
    groups: { id: string; title: string }[]
    title: string
    viewableAfter: Date
    points: number
  }): Item {
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

  function assignmentStatusToItem(status: {
    assignment: {
      category: { title: string }
      due: Date
      groups: { id: string; title: string }[]
      points: number
      title: string
      viewableAfter: Date
    }
    due: Date
    id: string
  }): Item {
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

  function resourceToItem(resource: {
    category: { title: string }
    creation: Date
    groups: { id: string; title: string }[]
    id: string
    managerIds: string[]
    title: string
    viewableAfter: Date
  }): Item {
    return {
      type: "resource",
      isManager: resource.managerIds.includes(data.account.id),
      category: resource.category.title,
      date: [resource.creation, new Date()],
      href: `/resource/${resource.id}`,
      group: findGroupThatUserIsMemberOf(resource.groups)?.title,
      title: resource.title,
      labels: [
        {
          content: toDateString(resource.viewableAfter),
          icon: faCalendar,
          title: "Visible after:",
        },
      ],
    }
  }

  function groupToItem(group: {
    id: string
    managerIds: string[]
    memberIds: string[]
    title: string
  }): Item {
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
    ...data.resources.map(resourceToItem),
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
          return true
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
    "card-deck": type.includes("card-deck"),
    discussion: type.includes("discussion"),
    group: type.includes("group"),
    resource: type.includes("resource"),
  }

  $: numberOfItemTypesSelected =
    +itemTypeFilter.assignment +
    +itemTypeFilter.group +
    +itemTypeFilter.resource

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

  $: groupFilterNames = [
    ...new Set(itemsFilteredByIsManager.map((e) => e.group!).filter((e) => e)),
  ].sort((a, b) => a.localeCompare(b, undefined))

  let selectedGroupFilters: string[] = []

  $: itemsFilteredByGroup =
    selectedGroupFilters.length != 0
      ? itemsFilteredByIsManager.filter(({ group }) =>
          selectedGroupFilters.includes(group || "")
        )
      : itemsFilteredByIsManager

  // #endregion
  // #region filter by categories

  $: categoryFilterNames = [
    ...new Set(itemsFilteredByGroup.map((e) => e.category!).filter((e) => e)),
  ].sort((a, b) => a.localeCompare(b, undefined))

  let selectedCategoryFilters: string[] = []

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

  let scrollY = 0

  const showAdvancedFilters = writable("show-advanced-filters", false)
</script>

<Title mode="head-only" title="Search" />

<svelte:window
  on:keydown={(event) => {
    if (event.key == "/") {
      event.preventDefault()
      searchEl?.focus()
    }
  }}
  bind:scrollY
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
        class="ring-color relative mx-0 flex items-center rounded-full px-4 py-1 shadow transition border-standard focus:z-10 focus:outline-none focus:ring"
        class:bg-filter={!isRangeCenterToday}
        class:bg-filter-active={isRangeCenterToday}
        href={mergeQueryParam($page.url, "date", new Date().toDateString())}
        on:click={() => (rangeCenter = new Date())}
      >
        Today
      </a>
    </div>
  {/if}
</div>

<div class="z-30 flex flex-wrap gap-4">
  <div class="mr-auto md:flex-1">
    <FilterList>
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
  </div>

  {#if browser}
    <button
      class="link"
      on:click={() =>
        showAdvancedFilters.update(
          ($showAdvancedFilters) => !$showAdvancedFilters
        )}
    >
      {$showAdvancedFilters ? "Hide" : "Show"} advanced filters
    </button>
  {/if}

  <div class="ml-auto flex justify-end md:flex-1">
    <FilterList>
      <Filter
        disabled={!itemsFilteredByType.some((item) => item.isManager)}
        param={["is-manager", "true"]}
        bind:active={isManagerFilter.true}
      >
        <Icon class="h-5 w-5 text-label" icon={faGear} />
      </Filter>

      <Filter
        disabled={!itemsFilteredByType.some((item) => !item.isManager)}
        param={["is-manager", "false"]}
        bind:active={isManagerFilter.false}
      >
        <Icon class="h-5 w-5 text-label" icon={faEye} />
      </Filter>
    </FilterList>
  </div>
</div>

{#if browser}
  {#if $showAdvancedFilters}
    <div class="z-20 mt-4 flex flex-wrap gap-2">
      <MultiSelect
        bind:values={selectedGroupFilters}
        class="prefer-w-72 h-60"
        minSearchableItems={9}
        noWrap
        options={groupFilterNames}
        searchLabel="Search for groups..."
      />

      <MultiSelect
        bind:values={selectedCategoryFilters}
        class="prefer-w-72 ml-auto h-60"
        minSearchableItems={9}
        noWrap
        options={categoryFilterNames}
        searchLabel="Search for categories..."
      />
    </div>
  {/if}

  <div
    class="sticky top-16 z-10 box-content flex w-full -translate-x-4 gap-4 py-4 px-4 backdrop-blur-lg md:-translate-x-8 md:px-8 lg:-translate-x-12 lg:px-12"
  >
    <input
      class="field z-10 w-full"
      placeholder="Search {itemsFilteredByCategory.length == 0
        ? 'your'
        : itemsFilteredByCategory.length} item{itemsFilteredByCategory.length ==
      1
        ? ''
        : 's'}..."
      type="search"
      bind:value={query}
      bind:this={searchEl}
      on:keydown|stopPropagation={() => {}}
    />

    {#if browser}
      <button
        class="field transition-all {scrollY > 0
          ? 'w-[2.625rem]'
          : '-ml-4 w-0 border-0 px-0 opacity-0'}"
        on:click={() => scrollTo({ behavior: "smooth", top: 0 })}
      >
        <Icon class="h-4 w-4" icon={faArrowUp} />
      </button>
    {/if}
  </div>
{/if}

{#if items.length != 0}
  <Table>
    {#each browser ? items : itemsFilteredByIsManager as item (item.href)}
      <a
        class="ring-color-initial transition-with-[grid-template-columns] grid w-full grid-rows-[auto_auto] gap-x-3 gap-y-1 rounded-lg px-3 py-2 focus:z-10 focus:-my-px focus:-ml-px focus:w-[calc(100%_+_2px)] focus:border focus:outline-none focus:ring {numberOfItemTypesSelected ==
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

        <p
          class="prefer-w-80 col-start-2 col-end-3 row-start-1 row-end-2 hyphens"
        >
          {item.title}
        </p>

        <IconLabels
          class="prefer-w-80 col-start-2 col-end-3 row-start-2 row-end-3 text-sm font-light text-label"
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
  </Table>
{:else}
  <p class="prefer-w-96 mx-auto flex flex-1 items-center">
    We can't find any items that involve you. Try picking a different set of
    filters.
  </p>
{/if}

<div hidden use:help>
  <p>The search page allows you to find assignments, groups, and resources.</p>

  <h2>Results</h2>

  <p>
    Each search result is labeled with a colored icon, a title, and some labels.
  </p>

  <p>
    The colored icon indicates the type of item. For example, a group is labeled
    with a <Icon
      class="icon-fill-blue mr-0"
      isLabel
      icon={faUserGroup}
      title="user group"
    /> icon.
  </p>

  <p>
    The icon on the lower left of an item <span class="whitespace-nowrap"
      >(<Icon class="top-0 mr-0" isLabel icon={faGear} title="gear" /> or <Icon
        class="top-0 -mr-1"
        isLabel
        icon={faEye}
        title="eye"
      />)</span
    >
    indicates whether you manage the item or not. A <Icon
      class="mr-0"
      isLabel
      icon={faGear}
      title="gear"
    /> icon indicates that you manage or created the item, while an <Icon
      class="mr-0"
      isLabel
      icon={faEye}
      title="eye"
    /> means the opposite.
  </p>

  <p>
    Additional icons also exist. For example, groups are labeled with how many
    members the have, while assignments are labeled with their due date.
  </p>

  <p>
    If an item has an <Icon
      class="top-0 mr-0"
      isLabel
      icon={faObjectGroup}
      title="object group"
    /> icon, it will indicate the category the item belongs to.
  </p>

  <p>
    If an item has a <Icon
      class="top-0 mr-0"
      isLabel
      icon={faPeopleGroup}
      title="people group"
    /> icon, it will indicate the group the item belongs to.
  </p>

  <h2>Date Filters</h2>

  <p>
    The topmost filter only shows item in a specified range of time. To show it,
    make sure either "Day," "Week," or "Month" is selected in the top left.
  </p>

  <p>
    Use the <span class="field inline-flex h-8 items-center py-0 bg-body"
      ><Icon class="h-4 w-4" icon={faChevronLeft} title="left arrow" /></span
    >
    and
    <span class="field inline-flex h-8 items-center py-0 bg-body"
      ><Icon class="h-4 w-4" icon={faChevronRight} title="right arrow" /></span
    > buttons to switch the time range.
  </p>

  <p>To quickly get back to the present day, press the "Today" button.</p>

  <h2>Filtering by Item Type</h2>

  <p>
    The second filter allows you to filter by item type. The <span
      class="whitespace-nowrap"
      ><Icon
        class="icon-fill-red -top-px -mr-1 h-4 w-4"
        icon={faTasks}
        isLabel
        title="tasks"
      />, <Icon
        class="icon-fill-blue -top-px -mr-1 h-4 w-4"
        icon={faUserGroup}
        isLabel
        title="user group"
      />, <Icon
        class="icon-fill-green -top-px mr-0 h-4 w-4"
        icon={faBookOpen}
        isLabel
        title="open book"
      />, and other colored</span
    > icons correspond to the item type shown in search.
  </p>

  <p>
    When this filter is active, the colored icons will disappear from search
    results, as they are redundant.
  </p>

  <h2>Filtering by Management</h2>

  <p>
    The third filter allows you to filter by whether you manage an item or not.
    The <span class="whitespace-nowrap"
      ><Icon class="-top-px mr-0 h-4 w-4" icon={faGear} isLabel title="gear" />
      and <Icon
        class="-top-px mr-0 h-4 w-4"
        icon={faEye}
        isLabel
        title="eye"
      /></span
    > icons correspond to the icon shown in search.
  </p>

  <p>
    When this filter is active, the <span class="whitespace-nowrap"
      ><Icon class="-top-px mr-0 h-4 w-4" icon={faGear} isLabel title="gear" />
      and <Icon
        class="-top-px mr-0 h-4 w-4"
        icon={faEye}
        isLabel
        title="eye"
      /></span
    > icons will disappear from search results, as they are redundant.
  </p>

  <h2>Advanced Filters</h2>

  <p>
    If you enable advanced filters, you will see two new search boxes. The left
    one filters your results by which class they are in, while the right one
    filters by category.
  </p>
</div>
