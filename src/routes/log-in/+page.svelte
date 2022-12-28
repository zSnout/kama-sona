<script lang="ts">
  import { enhance } from "$app/forms"
  import { PUBLIC_KS_APP_NAME } from "$env/static/public"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import type { ActionData } from "./$types"

  export let form: ActionData

  let disabled = false
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<CenterOnPage>
  {#if form}
    <div class="prefer-w-96 flex flex-col">
      <p>
        We sent a log in link to your email, {form.email}. Click it to log in to {PUBLIC_KS_APP_NAME}.
      </p>

      <p
        class="mt-4 border-l-2 py-1 pl-4 dark:border-l-slate-500 dark:text-slate-400"
      >
        If you don't receive a link, you might not be registered on {PUBLIC_KS_APP_NAME}.
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
          <p>Click to send a magic link to your email:</p>

          <button class="field w-full" type="submit" {disabled}>Log In</button>
        </label>

        <p class="mt-4 text-center">
          Or <a class="link" href="/sign-up">sign up</a> for a new account.
        </p>
      </form>
    </div>
  {/if}
</CenterOnPage>
