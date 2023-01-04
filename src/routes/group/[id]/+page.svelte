<script lang="ts">
  import AccountCard from "$lib/AccountCard.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import Icon from "$lib/Icon.svelte"
  import MegaStat from "$lib/MegaStat.svelte"
  import Subheading from "$lib/Subheading.svelte"
  import Title from "$lib/Title.svelte"
  import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
  import type { Account } from "@prisma/client"
  import type { PageData } from "./$types"

  export let data: PageData

  const filterOutManagers = (member: Account) =>
    !data.group.managers.some((manager) => manager.id == member.id)
</script>

<Title title={data.group.title} />

<CardGrid class="grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))]">
  <MegaStat>
    <p slot="title">Role</p>

    <p slot="value">{data.isManager ? "Manager" : "Member"}</p>
  </MegaStat>
</CardGrid>

<Subheading>Managers</Subheading>

<CardGrid
  class="grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
>
  {#each data.group.managers as member (member.id)}
    <AccountCard account={member} />
  {/each}
</CardGrid>

<Subheading>Members</Subheading>

<CardGrid
  class="grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
>
  {#if data.isManager}
    <AccountCard
      account={undefined}
      href="/group/{data.group.id}/add-members"
      title="Add Members"
    >
      <svelte:fragment slot="override">
        <Icon
          class="top-0 m-auto h-6 w-6 text-gray-400 dark:text-slate-450"
          icon={faUserPlus}
          title="Add members"
        />
      </svelte:fragment>
    </AccountCard>
  {/if}

  {#each data.group.members.filter(filterOutManagers) as member (member.id)}
    <AccountCard account={member} />
  {/each}
</CardGrid>
