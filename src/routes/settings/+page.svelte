<script lang="ts">
  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import Icon from "$lib/Icon.svelte"
  import type { Result } from "$lib/result"
  import Subheading from "$lib/Subheading.svelte"
  import Title from "$lib/Title.svelte"
  import { faTrash } from "@fortawesome/free-solid-svg-icons"
  import { startRegistration } from "@simplewebauthn/browser"
  import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
  import type { PageData } from "./$types"

  export let data: PageData

  let label = ""

  async function registerPasskey() {
    const realLabel = label

    if (!realLabel) {
      throw new Error("A passkey label is required.")
    }

    const data: PublicKeyCredentialCreationOptionsJSON = await fetch(
      "/passkey/register",
      { method: "GET" }
    ).then((response) => response.json())

    const response = await startRegistration(data)

    await fetch("/passkey/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...response, label: realLabel }),
    }).then((response) => response.json())

    location.reload()
  }
</script>

<Title title="Settings" />

<div class="prefer-w-md flex flex-col rounded-md rounded-b-lg bg-field">
  <Subheading class="mt-3 mb-1 px-4">Passkeys</Subheading>

  {#each data.passkeys as passkey}
    <div class="group mx-4 flex">
      <p>{passkey.label}</p>

      <a
        on:click={(event) => {
          if (
            !confirm(
              "Are you sure you want to delete the " +
                passkey.label +
                " passkey?"
            )
          ) {
            event.preventDefault()
            event.stopImmediatePropagation()
            return
          }

          goto("/passkey/delete/" + passkey.id, { replaceState: true })
        }}
        class="ml-auto scale-75 text-transparent transition duration-300 group-hover:scale-100 group-hover:text-current group-hover:duration-[0s]"
        href="/passkey/delete/{passkey.id}"
      >
        <Icon class="h-4 w-4" icon={faTrash} />
      </a>
    </div>
  {:else}
    <p class="mx-4">You don't have any passkeys.</p>
  {/each}

  {#if typeof PublicKeyCredential == "undefined"}
    {#if browser}
      <p class="mt-2 px-3 py-2">Your device doesn't support passkeys.</p>
    {:else}
      <noscript>
        <p class="mt-2 px-3 py-2">
          JavaScript must be enabled in order to register new passkeys.
        </p>
      </noscript>
    {/if}
  {:else}
    <form
      class="-mx-px mt-4 -mb-px flex flex-row"
      on:submit|preventDefault={registerPasskey}
    >
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
