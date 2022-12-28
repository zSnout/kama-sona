<script lang="ts">
  import AccountCard from "$lib/AccountCard.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<CardGrid
  class="grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-2"
>
  {#each data.group.members as member (member.id)}
    <AccountCard account={member} />
  {/each}
</CardGrid>
