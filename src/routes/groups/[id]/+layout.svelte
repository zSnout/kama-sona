<script lang="ts">
  import { page } from "$app/stores"
  import Tab from "$lib/Tab.svelte"
  import Tabs from "$lib/Tabs.svelte"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  let base = `/groups/${data.group.id}`
</script>

<Title title="Group - {data.group.name}">{data.group.name}</Title>

<Tabs class="mb-4">
  <Tab active={$page.url.pathname == base} href={base}>Overview</Tab>

  <Tab
    active={$page.url.pathname == `${base}/assignments`}
    href="{base}/assignments"
  >
    Assignments (TBD)
  </Tab>

  <Tab
    active={$page.url.pathname == `${base}/resources`}
    href="{base}/resources"
  >
    Resources (TBD)
  </Tab>

  <Tab
    active={$page.url.pathname == `${base}/discussions`}
    href="{base}/discussions"
  >
    Discussions (TBD)
  </Tab>

  <Tab active={$page.url.pathname == `${base}/members`} href="{base}/members">
    Members (TBD)
  </Tab>
</Tabs>

<slot />
