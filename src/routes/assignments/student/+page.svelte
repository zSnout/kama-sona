<script lang="ts">
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<div class="flex items-center">
  <Title title="My Assignments" />

  <a class="field ml-auto mb-4" href="/assignments/teacher">Assign Things</a>
</div>

{#each data.assignments as assignment}
  <p>{JSON.stringify(assignment, undefined, 2)}</p>
{:else}
  <p>Congratulations! You have no assignments ... yet.</p>
{/each}
