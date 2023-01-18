<script lang="ts">
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"

  let disabled = false
</script>

<svelte:head>
  <title>Create a Card Deck</title>
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
        <p>Deck title:</p>

        <input
          type="text"
          name="title"
          class="field w-full"
          required
          maxlength="32"
        />
      </label>

      <label class="label w-full">
        <p>Click to create your card deck:</p>

        <button class="field w-full" type="submit" {disabled}>
          Create Deck
        </button>
      </label>
    </form>
  </div>
</CenterOnPage>
