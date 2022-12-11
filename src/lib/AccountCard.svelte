<script lang="ts">
  import type { Account } from "@prisma/client"

  export let account: Account
  export let href: string | undefined = undefined
</script>

<a
  class="flex flex-col rounded-lg bg-white py-4 px-6 shadow-md dark:bg-slate-850"
  href={href || `/directory/${account.id}`}
>
  <div
    class="overflow-hidden text-ellipsis whitespace-nowrap text-sm opacity-60"
  >
    <p class="sr-only">Email address:</p>
    {account.email}
  </div>

  <div class="whitespace-nowrap text-xl font-bold">
    <p class="sr-only">Name:</p>
    {account.name}
  </div>
</a>
