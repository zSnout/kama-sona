<script lang="ts">
  import { help } from "$lib/help"
  import ProgressCircle from "$lib/ProgressCircle.svelte"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title="Progress" />

<div class="flex flex-wrap justify-center gap-4">
  {#each data.groups as group (group.id)}
    <ProgressCircle
      class="h-52 w-52"
      href="/progress/{group.id}"
      type="a"
      value={group.grade.points ? group.grade.ratio : -1}
    >
      <p class="max-w-full text-center text-label hyphens">
        {group.title}
      </p>

      <p class="text-center text-lg font-light">
        {#if group.grade.points}
          {(group.grade.ratio * 100).toFixed(2)}%
        {:else}
          N/A
        {/if}
      </p>
    </ProgressCircle>
  {:else}
    <div>None of your groups have graded assignments!</div>
  {/each}
</div>

<div hidden use:help>
  <p>The progress page is where you can see your grades.</p>

  <p>To see details about a group, click its circle.</p>

  <p>
    If a circle says "N/A," it means your teacher in the group hasn't graded any
    of your assignments yet.
  </p>
</div>
