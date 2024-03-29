<script lang="ts">
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import AccountCard from "$lib/AccountCard.svelte"
  import { help } from "$lib/help"
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

  let added: Record<string, boolean> = {}
</script>

<svelte:head>
  <title>Add members to {data.group.title}</title>
</svelte:head>

{#if data.accounts.length != 0}
  <p class="flex items-center">
    <span class="mr-4">Click a user's account to add them to your group.</span>

    <a class="field ml-auto inline" href="/group/{data.group.id}">Back</a>
  </p>

  <input
    type="search"
    class="field my-4"
    placeholder="Search for users..."
    bind:value={query}
  />
{:else}
  <p class="prefer-w-96 m-auto flex flex-1 items-center">
    It looks like every person on {PUBLIC_KS_APP_NAME} is already in your group!
  </p>
{/if}

{#if filtered.length != 0}
  <div>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
    >
      {#each filtered as account}
        <AccountCard
          {account}
          isButton
          href="/group/{data.group.id}/add-members/{account.id}"
          class="transition {added[account.id] ? 'opacity-30' : ''}"
          on:click={() => (added[account.id] = true)}
        />
      {/each}
    </div>
  </div>
{:else}
  <p class="prefer-w-96 m-auto flex flex-1 items-center">
    It looks like nobody matches your search query! Try changing it to see more
    people.
  </p>
{/if}

<div hidden use:help>
  <p>This page lets you add members to a group.</p>

  <p>Click a user to add them to {data.group.title}.</p>
</div>
