<div class="flex flex-col rounded-2xl py-4 px-6 shadow-md bg-field">
  {#if $$slots.title}
    <div class="whitespace-nowrap opacity-60">
      <slot name="title" />
    </div>
  {/if}

  <div class="whitespace-nowrap text-4xl font-bold">
    <slot name="value" />
  </div>

  {#if $$slots.desc}
    <div class="whitespace-nowrap text-xs opacity-60">
      <slot name="desc" />
    </div>
  {/if}
</div>
