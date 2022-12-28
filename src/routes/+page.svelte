<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import Card from "$lib/Card.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import { pages } from "$lib/pages"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"
  import NavIcon from "./NavIcon.svelte"
  import PageInfo from "./PageInfo.svelte"

  export let data: PageData
</script>

<Title title={PUBLIC_KS_APP_NAME} mode="head-only" />

<p class="mb-5 select-none text-center text-lg font-semibold">
  Welcome back, {data.account.name}!
</p>

<CardGrid
  class="grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))]"
  clip
>
  <Card>
    <p class="font-bold">Quick Actions</p>

    <div
      class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2"
    >
      <a class="field" href="/log-out">Log Out</a>

      <a class="field" href="/create">Create an Item</a>

      <a class="field" href="/search">Open Search</a>
    </div>
  </Card>

  {#each pages as page}
    <PageInfo href={page.href} class="text-{page.color}-500" title={page.title}>
      <NavIcon slot="icon" icon={page.icon} class="icon-{page.color}" />
    </PageInfo>
  {/each}
</CardGrid>
