<script lang="ts">
  import type { Account } from "@prisma/client"

  /** Only pass `account={undefined}` if you also pass an `override` slot. */
  export let account: Account | undefined
  export let href = `/directory/${account?.id}`
  export let isButton = false
  export let title: string | undefined = undefined

  const id = Math.random().toString(36).slice(2)
</script>

{#if isButton}
  <form class="hidden" id="x-{id}" />
{/if}

<svelte:element
  this={isButton ? "button" : "a"}
  class="flex flex-col rounded-lg bg-white py-4 px-6 text-left shadow-md before:whitespace-nowrap dark:bg-slate-850"
  form="x-{id}"
  formaction={isButton ? href : undefined}
  formmethod={isButton ? "post" : undefined}
  href={isButton ? undefined : href}
  type="submit"
  data-tooltip={title}
>
  <slot name="override">
    <div class="max-w-full">
      <div
        class="overflow-hidden text-ellipsis whitespace-nowrap text-sm opacity-60"
      >
        <p class="sr-only">Email address:</p>
        {account?.email}
      </div>

      <div
        class="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold"
      >
        <p class="sr-only">Name:</p>
        {account?.name}
      </div>
    </div>
  </slot>
</svelte:element>
