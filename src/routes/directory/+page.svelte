<script lang="ts">
  import AccountCard from "$lib/AccountCard.svelte"
  import { help } from "$lib/help"
  import Title from "$lib/Title.svelte"
  import { search } from "fast-fuzzy"
  import type { PageData } from "./$types"

  export let data: PageData

  let query = ""

  $: filtered = query
    ? search(query, data.accounts, {
        keySelector(account) {
          return [account.name, account.email]
        },
      })
    : data.accounts
</script>

<Title title="Directory" />

<input
  type="search"
  class="field my-4"
  placeholder="Search for users..."
  bind:value={query}
/>

{#if filtered.length != 0}
  <div>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
    >
      {#each filtered as account}
        <AccountCard {account} />
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
  <p>This page lets you see everybody in your school.</p>

  <p>Click a user's account to see more information about them.</p>
</div>
