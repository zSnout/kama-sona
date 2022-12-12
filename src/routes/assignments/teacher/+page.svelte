<script lang="ts">
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<div class="flex items-center">
  <Title title="Assign Things" />

  <a class="field ml-auto mb-4" href="/assignments/student">My Assignments</a>
</div>

<div class="mb-4 flex">
  <a class="field prefer-w-96 mx-auto" href="/assignments/teacher/create">
    Create an Assignment
  </a>
</div>

{#each data.assignments as assignment}
  <p>{JSON.stringify(assignment, undefined, 2)}</p>
{:else}
  <p>Congratulations! You haven't assigned anything ... yet.</p>
{/each}
