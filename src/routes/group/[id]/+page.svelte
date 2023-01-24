<script lang="ts">
  import AccountCard from "$lib/AccountCard.svelte"
  import { help } from "$lib/help"
  import Icon from "$lib/Icon.svelte"
  import MegaStat from "$lib/MegaStat.svelte"
  import Subheading from "$lib/Subheading.svelte"
  import Title from "$lib/Title.svelte"
  import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"

  export let data: PageData

  const isNotManager = (member: { id: string }) =>
    !data.group.managerIds.includes(member.id)
</script>

<Title title={data.group.title} />

<div
  class="grid grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))] gap-2"
>
  <MegaStat>
    <p slot="title">Role</p>

    <p slot="value">{data.isManager ? "Manager" : "Member"}</p>
  </MegaStat>
</div>

<Subheading>Manager{data.group.managerIds.length == 1 ? "" : "s"}</Subheading>

<div
  class="grid grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
>
  {#each data.group.managers as member (member.id)}
    <AccountCard account={member} />
  {/each}
</div>

<Subheading>
  Member{data.group.members.length == 1 ? "" : "s"} ({data.group.members
    .length})
</Subheading>

<div
  class="grid grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
>
  {#if data.isManager}
    <AccountCard
      account={undefined}
      href="/group/{data.group.id}/add-members"
      title="Add Members"
    >
      <svelte:fragment slot="override">
        <Icon
          class="top-0 m-auto h-6 w-6 text-icon"
          icon={faUserPlus}
          title="Add members"
        />
      </svelte:fragment>
    </AccountCard>
  {/if}

  {#each data.group.members.filter(isNotManager) as member (member.id)}
    <AccountCard account={member} />
  {/each}
</div>

<div hidden use:help>
  <p>
    This page is a group overview. You can see the managers and members of a
    group, as well as your status within it.
  </p>

  <p>
    If you manage this group, you'll be able to add members by clicking the <Icon
      class="relative -top-px m-auto inline-block h-4 w-4 text-icon"
      icon={faUserPlus}
      title="user plus"
    /> icon.
  </p>

  <p>You can click a user to get more information about them.</p>
</div>
