<script lang="ts">
  import { page } from "$app/stores"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
</script>

<CenterOnPage>
  <div class="flex max-w-full flex-col items-center">
    <div class="flex items-center">
      <p
        class="mr-8 border-r border-r-gray-300 py-4 pr-8 text-5xl font-extralight dark:border-r-slate-600"
      >
        {$page.status}
      </p>

      <span class="sr-only">|</span>

      <p class="max-w-sm whitespace-pre-wrap py-4">{$page.error?.message}</p>
    </div>

    <div class="prefer-w-96 mt-6 flex flex-wrap gap-6">
      <a
        class="field min-w-[10rem] flex-1 whitespace-pre"
        href={$page.url.pathname}>Try Again</a
      >

      <a
        class="field min-w-[10rem] flex-1 whitespace-pre"
        href="https://github.com/zSnout/kama-sona/issues/new?assignees=&labels=bug&template=bug-report.yaml&error-code={$page.status}+|+{encodeURIComponent(
          $page.error?.message || ''
        )}">File a Bug Report</a
      >
    </div>
  </div>
</CenterOnPage>
