<script>
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Icon from "$lib/Icon.svelte"
  import { pages } from "$lib/pages"
  import Title from "$lib/Title.svelte"
</script>

<CenterOnPage>
  <Title title="Create an Item" />

  <div class="grid max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each pages as page}
      {#if page.create}
        <a
          class="bg-{page.color}-200 dark:bg-{page.color}-900 shadow-{page.color}-100 ring-{page.color}-500 hover:border-{page.color}-500 prefer-w-48 flex h-48 flex-col items-center justify-center gap-4 rounded-lg border border-transparent shadow-lg outline-none transition focus:ring dark:shadow-none"
          href="/create/{page.create.type}"
        >
          <Icon class="icon-{page.color} h-8 w-8" icon={page.icon} />

          <p
            class="text-{page.color}-700 dark:text-{page.color}-300 font-semibold"
          >
            {page.create.singular}
          </p>
        </a>
      {/if}
    {/each}
  </div>
</CenterOnPage>
