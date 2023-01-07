<script>
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import IconColorAndText from "$lib/IconColorAndText.svelte"
  import { pages } from "$lib/pages"
  import Title from "$lib/Title.svelte"
</script>

<CenterOnPage>
  <Title title="Create an Item" />

  <div class="grid max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
    {#each pages as page}
      {#if page.create}
        <IconColorAndText
          color={page.color}
          href="/create/{page.create.type}"
          icon={page.icon}
          label={page.create.singular}
        />
      {/if}
    {/each}
  </div>
</CenterOnPage>
