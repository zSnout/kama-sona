<script lang="ts">
  import AccountCard from "$lib/AccountCard.svelte"
  import CardGrid from "$lib/CardGrid.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<CardGrid class="grid-cols-[repeat(auto-fill,minmax(min(15em,100%),1fr))]">
  {#each data.group.members as member (member.id)}
    <AccountCard account={member} />
  {/each}
</CardGrid>
