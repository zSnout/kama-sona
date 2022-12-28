<script lang="ts">
  import { page } from "$app/stores"
  import Tab from "$lib/Tab.svelte"
  import Tabs from "$lib/Tabs.svelte"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  let base = `/group/${data.group.id}`
</script>

<Title title={data.group.title} />

<Tabs class="mb-4">
  <Tab active={$page.url.pathname == base} href={base}>Overview</Tab>

  <Tab
    active={$page.url.pathname == `${base}/assignment`}
    href="{base}/assignment"
  >
    Assignments (TBD)
  </Tab>

  <Tab active={$page.url.pathname == `${base}/resource`} href="{base}/resource">
    Resources (TBD)
  </Tab>

  <Tab
    active={$page.url.pathname == `${base}/discussion`}
    href="{base}/discussion"
  >
    Discussions (TBD)
  </Tab>

  <Tab active={$page.url.pathname == `${base}/members`} href="{base}/members">
    Members (TBD)
  </Tab>

  <Tab
    active={$page.url.pathname == `${base}/members/add`}
    href="{base}/members/add"
  >
    Add Members (TBD)
  </Tab>
</Tabs>

<slot />
