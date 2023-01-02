<script lang="ts">
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title="User Profile" />

<p class="select-all">{data.profile.name}</p>

<p class="select-all">{data.profile.email}</p>
