<script lang="ts">
  import CardGrid from "$lib/CardGrid.svelte"
  import MegaStat from "$lib/MegaStat.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<CardGrid class="grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))]">
  <MegaStat>
    <p slot="title">Role</p>

    <p slot="value">
      {data.group.managerIds.includes(data.account.id) ? "Manager" : "Member"}
    </p>
  </MegaStat>
</CardGrid>
