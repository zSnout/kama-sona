<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
  import { goto } from "$app/navigation"
  import {
    PUBLIC_KS_APP_NAME,
    PUBLIC_KS_BYPASS_LOGIN,
    PUBLIC_KS_ENABLE_SIGN_UP,
  } from "$env/static/public"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Icon from "$lib/Icon.svelte"
  import type { Result } from "$lib/result"
  import { faFingerprint } from "@fortawesome/free-solid-svg-icons"
  import {
    browserSupportsWebAuthn,
    browserSupportsWebAuthnAutofill,
    startAuthentication,
  } from "@simplewebauthn/browser"
  import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
  import type { ActionData } from "./$types"

  export let form: ActionData

  let disabled = false

  if (browser) {
    setTimeout(() => showPasskey(true))
  }

  let passkeyError = ""

  async function showPasskey(conditionalUI: boolean) {
    try {
      const data: PublicKeyCredentialCreationOptionsJSON = await fetch(
        "/log-in/passkey",
        { method: "GET" }
      ).then((response) => response.json())

      const response = await startAuthentication(data, conditionalUI)

      const didVerify:
        | Result<void>
        | { message: string; result?: Result<void> } = await fetch(
        "/log-in/passkey",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }
      ).then((response) => response.json())

      if ("message" in didVerify) {
        if (didVerify.result?.ok) {
          goto("/")
        } else {
          passkeyError = didVerify.message
        }
      } else if (didVerify.ok) {
        goto("/")
      } else {
        passkeyError = didVerify.error
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      if (
        message.includes("User clicked cancel") ||
        message.includes("Cancelling existing WebAuthn API call")
      ) {
        return
      }

      passkeyError = message
    }
  }
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

      <p class="mt-4 border-l-2 py-1 pl-4 border-standard text-label">
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
            autocomplete="username webauthn"
            class="field w-full"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
          />
        </label>

        <div class="mt-6 flex items-end gap-4">
          <label class="label w-full" for="log-in">
            <p>
              Click to {PUBLIC_KS_BYPASS_LOGIN == "true"
                ? "log in:"
                : "send a magic link to your email:"}
            </p>

            <button
              class="field h-10.5 w-full"
              id="log-in"
              type="submit"
              {disabled}
            >
              Log In
            </button>
          </label>

          {#if browser && browserSupportsWebAuthn() && !browserSupportsWebAuthnAutofill()}
            <button
              class="field h-10.5 w-10.5 before:whitespace-nowrap"
              type="button"
              data-tooltip="Use a Passkey"
              on:click|preventDefault={() => showPasskey(false)}
            >
              <Icon class="h-4 w-4" icon={faFingerprint} />
            </button>
          {/if}
        </div>

        {#if PUBLIC_KS_ENABLE_SIGN_UP == "true"}
          <p class="mt-4 text-center">
            Or <a class="link" href="/sign-up">sign up</a> for a new account.
          </p>
        {/if}

        {#if passkeyError}
          <p class="mt-4 text-center">
            An error occurred: {passkeyError}
          </p>
        {/if}
      </form>
    </div>
  {/if}
</CenterOnPage>
