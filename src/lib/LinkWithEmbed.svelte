<script lang="ts">
  import Icon from "./Icon.svelte"
  import { linkToIcon } from "./toIcon"

  export let href: string
  export let title: string
</script>

<a
  class="field block w-full overflow-hidden text-left"
  class:degroup={href.includes("docs.google.com/document") ||
    href.includes("docs.google.com/presentation") ||
    href.includes("docs.google.com/spreadsheets")}
  {href}
  rel="noopener noreferrer nofollow"
  target="_blank"
  type="button"
>
  <p class="overflow-hidden text-ellipsis whitespace-nowrap">
    <Icon isLabel icon={linkToIcon(href)} />
    {title}
  </p>

  {#if href.includes("docs.google.com/presentation")}
    <iframe
      class="pointer-events-none relative top-px -mx-3 -mb-2 mt-2 aspect-video w-[calc(100%_+_1.5rem_+_2px)]"
      src="https://docs.google.com/presentation{href.match(
        /\/d\/([A-Za-z0-9\-\_]+)/
      )?.[0]}/preview?rm=minimal&slide=1"
      title="Embedded Google Slides presentation"
      aria-hidden="true"
    />
  {:else if href.includes("docs.google.com/spreadsheets")}
    <iframe
      class="pointer-events-none relative top-px -mx-3 mb-[calc(-56.25%_-_2.25rem)] mt-2 aspect-video w-[calc(200%_+_3rem_+_4px)] origin-top-left scale-50"
      src="https://docs.google.com/spreadsheets{href.match(
        /\/d\/([A-Za-z0-9\-\_]+)/
      )?.[0]}/preview?rm=minimal&slide=1"
      title="Embedded Google Sheets spreadsheet"
      aria-hidden="true"
    />
  {:else if href.includes("docs.google.com/document")}
    <iframe
      size="0.5"
      class="pointer-events-none relative top-px -mx-4 mb-[calc(-100%_-_2.25rem)] mt-2 aspect-square w-[calc(200%_+_3rem_+_8px)] origin-top-left scale-50 bg-white px-8"
      src="https://docs.google.com/document{href.match(
        /\/d\/([A-Za-z0-9\-\_]+)/
      )?.[0]}/mobilebasic?rm=minimal"
      title="Embedded Google Docs document"
      aria-hidden="true"
    />
  {/if}
</a>
