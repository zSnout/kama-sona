<script>
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import { pages } from "$lib/pages"
  import Title from "$lib/Title.svelte"
</script>

<CenterOnPage>
  <Title title="Create an Item" />

  <div class="grid max-w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {#each pages as page}
      {#if page.create}
        <BigButtonColored
          color={page.color}
          href="/create/{page.create.type}"
          icon={page.icon}
          label={page.create.singular}
        />
      {/if}
    {/each}
  </div>
</CenterOnPage>
