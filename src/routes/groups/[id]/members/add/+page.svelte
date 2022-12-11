<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import AccountCard from "$lib/AccountCard.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  let query = ""

  $: filtered = data.accounts.filter(
    (account) =>
      !data.group.memberIds.includes(account.id) &&
      (!query ||
        account.name.toLowerCase().includes(query.toLowerCase()) ||
        account.email.toLowerCase().includes(query.toLowerCase()))
  )
</script>

{#if filtered.length != 0}
  <p>Click a user's account to add them to your group.</p>

  <input
    type="search"
    class="field my-4"
    placeholder="Search for users..."
    bind:value={query}
  />
{/if}

<div>
  <CardGrid
    class="grid-cols-[repeat(auto-fill,minmax(min(13em,100%),1fr))] gap-2"
  >
    {#each filtered as account}
      <AccountCard
        {account}
        href="/groups/{data.group.id}/members/add/{account.id}"
      />
    {:else}
      <p>
        It looks like every person on {PUBLIC_KS_APP_NAME} is already in your group!
      </p>
    {/each}
  </CardGrid>
</div>
