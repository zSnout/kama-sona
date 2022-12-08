<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import Title from "$lib/Title.svelte"
  import {
    faBookOpen,
    faChartPie,
    faClock,
    faComments,
    faTasks,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"
  import PageInfo from "./PageInfo.svelte"
  import NavIcon from "./NavIcon.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import Card from "$lib/Card.svelte"

  export let data: PageData
</script>

<Title title={PUBLIC_KS_APP_NAME} mode="head-only" />

<p class="mb-5 select-none text-center text-lg font-semibold">
  Welcome back, {data.account?.name}!
</p>

<CardGrid class="grid-cols-[repeat(auto-fill,minmax(min(20em,100%),1fr))]" clip>
  <Card>
    <p class="font-bold">Quick Actions</p>

    <CardGrid class="grid-cols-[repeat(auto-fill,minmax(min(10em,100%),1fr))]">
      <a class="field mt-4 block" href="/log-out">Log Out</a>
    </CardGrid>
  </Card>

  <PageInfo
    href="/assignments"
    class="text-red-600 dark:text-red-400"
    title="Assignments"
  >
    <NavIcon slot="icon" icon={faTasks} class="icon-red" />
  </PageInfo>

  <PageInfo
    href="/groups"
    class="text-blue-600 dark:text-blue-400"
    title="Groups"
  >
    <NavIcon slot="icon" icon={faUserGroup} class="icon-blue" />
  </PageInfo>

  <PageInfo
    href="/progress"
    class="text-yellow-600 dark:text-yellow-400"
    title="Progress"
  >
    <NavIcon slot="icon" icon={faChartPie} class="icon-yellow" />
  </PageInfo>

  <PageInfo
    href="/resources"
    class="text-green-600 dark:text-green-400"
    title="Resources"
  >
    <NavIcon slot="icon" icon={faBookOpen} class="icon-green" />
  </PageInfo>

  <PageInfo
    href="/discussions"
    class="text-purple-600 dark:text-purple-400"
    title="Discussions"
  >
    <NavIcon slot="icon" icon={faComments} class="icon-purple" />
  </PageInfo>

  <PageInfo
    href="/schedule"
    class="text-orange-600 dark:text-orange-400"
    title="Schedule"
  >
    <NavIcon slot="icon" icon={faClock} class="icon-orange" />
  </PageInfo>
</CardGrid>
