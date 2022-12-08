<script lang="ts">
  import { enhance } from "$app/forms"
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Title from "$lib/Title.svelte"
  import type { ActionData, PageData } from "./$types"

  export let data: PageData
  export let form: ActionData

  let disabled = false
</script>

<svelte:head>
  <title>Create an Admin Account</title>
</svelte:head>

<CenterOnPage>
  {#if !form}
    <form
      class="prefer-w-96 flex flex-col"
      method="post"
      on:submit={() => (disabled = true)}
      use:enhance
    >
      <label class="label w-full">
        <p>Email address</p>

        <input
          class="field w-full"
          name="email"
          placeholder="john@example.com"
          required
          type="email"
        />
      </label>

      <label class="label w-full">
        <p>Full name</p>

        <input
          autocomplete="name"
          class="field w-full"
          name="name"
          required
          type="text"
        />
      </label>

      <label class="label w-full">
        <p>Click to create your account:</p>

        <button class="field w-full" type="submit" {disabled}>
          Create an Admin Account
        </button>
      </label>

      {#if data.admins.length > 0}
        <p class="mt-4 max-w-sm">
          Warning: There {data.admins.length > 1 ? "are" : "is"} already {data
            .admins.length} admin account{data.admins.length > 1 ? "s" : ""}: {data.admins.map(
            (account) => account.email
          )}
        </p>
      {/if}
    </form>
  {:else}
    <Title title="Create an Admin Account" mode="body-only" />

    <p class="max-w-md">
      Congrats, {form.name}! You now have an admin account on {PUBLIC_KS_APP_NAME}.
      Restart kama sona with the <strong>PUBLIC_KS_APP_NAME</strong> flag
      disabled, then log in using your email address {form.email}.
    </p>
  {/if}
</CenterOnPage>
