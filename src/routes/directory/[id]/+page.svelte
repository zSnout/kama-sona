<script lang="ts">
  import { help } from "$lib/help"
  import Title from "$lib/Title.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title="User Profile" />

<p class="select-all">{data.profile.name}</p>

<p class="select-all">{data.profile.email}</p>

<div hidden use:help>
  <p>This page shows the name and email address of a user.</p>

  <p>It needs some work.</p>
</div>
