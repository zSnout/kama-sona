<script lang="ts">
  import Icon from "$lib/Icon.svelte"
  import Title from "$lib/Title.svelte"
  import { faUserAltSlash } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<Title title={data.assignment.title} />

<div class="flex flex-1 flex-col items-center justify-center text-center">
  <Icon class="mb-2 block h-12 w-12" isLabel icon={faUserAltSlash} />

  <p>No student selected.</p>
</div>
