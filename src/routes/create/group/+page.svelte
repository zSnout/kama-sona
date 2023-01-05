<script lang="ts">
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"

  let disabled = false
</script>

<svelte:head>
  <title>Create a Group</title>
</svelte:head>

<CenterOnPage>
  <div class="prefer-w-96">
    <form
      class="flex w-full flex-col"
      method="post"
      use:enhance
      on:submit={() => (disabled = true)}
    >
      <label class="label w-full">
        <p>Group name:</p>

        <input
          type="text"
          name="title"
          class="field w-full"
          required
          maxlength="32"
        />
      </label>

      <label class="label w-full">
        <p>Click to create your group:</p>

        <button class="field w-full" type="submit" {disabled}>
          Create Group
        </button>
      </label>
    </form>
  </div>
</CenterOnPage>
