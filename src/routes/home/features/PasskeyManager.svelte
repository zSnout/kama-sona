<script lang="ts">
  import { browser } from "$app/environment"
  import BigButton from "$lib/BigButton.svelte"
  import type { Result } from "$lib/result"
  import { faKey } from "@fortawesome/free-solid-svg-icons"
  import { startRegistration } from "@simplewebauthn/browser"
  import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
  import type { Feature } from "../layout"

  export let feature: Feature

  async function arePasskeysEnabled(): Promise<boolean> {
    if (!browser) {
      return false
    }

    return (
      typeof PublicKeyCredential != "undefined" &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable ==
        "function" &&
      (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
    )
  }

  async function register() {
    try {
      const data: PublicKeyCredentialCreationOptionsJSON = await fetch(
        "/passkey/register",
        { method: "GET" }
      ).then((response) => response.json())

      const response = await startRegistration(data)

      const didVerify: Result<void> = await fetch("/passkey/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      }).then((response) => response.json())

      if (didVerify.ok) {
        alert("Passkey created successfully!")
      } else {
        alert("An error occurred: " + didVerify.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name == "InvalidStateError") {
          // The user is already registered
        }

        if (error.name == "NotAllowedError") {
          // The user has cancelled the operation
        }

        alert("An error occurred: " + (error.message || "Unknown error"))
      } else {
        alert("An error occurred: " + (String(error) || "Unknown error"))
      }
    }
  }
</script>

<div
  class="my-auto flex justify-center gap-4"
  style:grid-area="{feature.startY} / {feature.startX} / {feature.endY + 1} / {feature.endX +
    1}"
>
  {#await arePasskeysEnabled() then isPasskeyAvailable}
    {#if isPasskeyAvailable}
      <BigButton on:click={register} icon={faKey} label="Create" />
    {:else}
      <p>Passkeys are not supported on your device.</p>
    {/if}
  {/await}
</div>
