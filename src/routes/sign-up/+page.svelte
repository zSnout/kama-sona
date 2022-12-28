<script lang="ts">
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import type { ActionData } from "./$types"

  export let form: ActionData

  let disabled = false
</script>

<svelte:head>
  <title>Sign Up</title>
</svelte:head>

<CenterOnPage>
  {#if form}
    <div class="prefer-w-96 flex flex-col">
      <p>Hey {form.name}!</p>

      <p>
        Before we can make you an account, we need to make sure you're not a
        robot. To verify you're a human, just click the link we sent to your
        email, {form.email}. That's it!
      </p>

      <p
        class="mt-4 border-l-2 py-1 pl-4 dark:border-l-slate-500 dark:text-slate-400"
      >
        Didn't receive a link? Just sign up again!
      </p>
    </div>
  {:else}
    <div class="prefer-w-96">
      <form
        class="flex w-full flex-col"
        method="post"
        use:enhance
        on:submit={() => (disabled = true)}
      >
        <label class="label w-full">
          <p>Email address:</p>

          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            class="field w-full"
            required
          />
        </label>

        <label class="label w-full">
          <p>Full name:</p>

          <input
            type="text"
            name="name"
            class="field w-full"
            pattern="\S+ \S+"
            required
          />
        </label>

        <label class="label w-full">
          <p>Click to create your account:</p>

          <button class="field w-full" type="submit" {disabled}>Sign Up</button>
        </label>

        <p class="mt-4 text-center">
          Or <a class="link" href="/log-in">log in</a> to an existing account.
        </p>
      </form>
    </div>
  {/if}
</CenterOnPage>
