<script lang="ts">
  import Icon from "$lib/Icon.svelte"
  import type { Result } from "$lib/result"
  import Subheading from "$lib/Subheading.svelte"
  import Title from "$lib/Title.svelte"
  import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
  import { startRegistration } from "@simplewebauthn/browser"
  import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
  import type { PageData } from "./$types"

  export let data: PageData

  let label = ""

  async function registerPasskey() {
    try {
      const realLabel = label

      if (!realLabel) {
        throw new Error("A passkey label is required.")
      }

      const data: PublicKeyCredentialCreationOptionsJSON = await fetch(
        "/passkey/register",
        { method: "GET" }
      ).then((response) => response.json())

      const response = await startRegistration(data)

      const didVerify: Result<void> = await fetch("/passkey/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, label: realLabel }),
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

<Title title="Settings" />

<div class="prefer-w-md flex flex-col rounded-md rounded-b-lg bg-field">
  <Subheading class="mt-3 mb-1 px-4">Passkeys</Subheading>

  {#each data.passkeys as passkey}
    <div class="group mx-4 flex">
      <p>{passkey.label}</p>

      <button
        on:click={() => {
          fetch("/passkey/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: passkey.id }),
          }).then((response) => response.json())
        }}
        class="ml-auto scale-75 text-transparent transition duration-300 group-hover:scale-100 group-hover:text-current group-hover:duration-[0s]"
      >
        <Icon class="h-4 w-4" icon={faTrash} />
      </button>
    </div>
  {:else}
    <p class="mx-4">You don't have any passkeys.</p>
  {/each}

  {#if typeof PublicKeyCredential == "undefined"}
    <p>Your device doesn't support passkeys.</p>
  {:else}
    <form class="mt-4 flex flex-row" on:submit|preventDefault={registerPasskey}>
      <input
        bind:value={label}
        class="field relative h-9 flex-1 rounded-t-none rounded-br-none focus:z-10"
        type="text"
        placeholder="Passkey name..."
        required
      />

      <button
        class="field prefer-w-80 relative -ml-px flex h-9 w-fit items-center justify-center rounded-t-none rounded-bl-none before:whitespace-nowrap"
        type="submit"
      >
        Create Passkey
      </button>
    </form>
  {/if}
</div>
