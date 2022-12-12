<script lang="ts">
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title="User Profile" />

<p>{data.profile.name}</p>
<p>{data.profile.email}</p>
