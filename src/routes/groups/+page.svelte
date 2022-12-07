<script lang="ts">
  import CardGrid from "$lib/CardGrid.svelte"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title="My Groups" />

<CardGrid
  class="grid-cols-[repeat(auto-fill,minmax(min(12em,100%),1fr))] gap-2"
>
  <a class="field" href="/groups/create">Create a Group</a>

  {#each data.groups as group}
    <a class="field" href="/groups/{group.id}">
      {group.name}
    </a>
  {/each}
</CardGrid>
