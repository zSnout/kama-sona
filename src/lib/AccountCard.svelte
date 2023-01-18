<script lang="ts">
  import type { Account } from "@prisma/client"

  /** Only pass `account={undefined}` if you also pass an `override` slot. */
  export let account: Account | undefined
  export let href = `/directory/${account?.id}`
  export let isButton = false
  export let title: string | undefined = undefined

  let className = ""
  export { className as class }

  const id = Math.random().toString(36).slice(2)
</script>

{#if isButton}
  <form class="hidden" id="x-{id}" />
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={isButton ? "button" : "a"}
  class="{className} flex flex-col rounded-lg py-4 px-6 text-left shadow-md bg-field text-field before:whitespace-nowrap"
  form="x-{id}"
  formaction={isButton ? href : undefined}
  formmethod={isButton ? "post" : undefined}
  href={isButton ? undefined : href}
  type="submit"
  data-tooltip={title}
  on:click
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
