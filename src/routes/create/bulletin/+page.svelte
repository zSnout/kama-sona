<script lang="ts">
  import { enhance } from "$app/forms"
  import BulletinButton from "$lib/BulletinButton.svelte"
  import CenterOnPage from "$lib/CenterOnPage.svelte"

  let title = ""
  let body = ""
</script>

<svelte:head>
  <title>Create a Bulletin</title>
</svelte:head>

<CenterOnPage>
  <form class="flex flex-col" method="post" use:enhance>
    <div class="flex flex-1 items-center gap-12">
      <div class="prefer-w-96 flex flex-1 flex-col">
        <label class="label mb-auto block w-full">
          <p>Bulletin title:</p>

          <input
            class="field w-full"
            maxlength="32"
            name="title"
            required
            type="text"
            bind:value={title}
          />
        </label>

        <label class="label prefer-w-96 flex flex-col">
          <p>Bulletin description:</p>

          <textarea
            class="field min-h-[10.5rem] w-full"
            maxlength="10000"
            name="body"
            required
            bind:value={body}
          />
        </label>
      </div>

      <div class="hidden md:block">
        <div class="label flex flex-col">
          <p>Preview:</p>

          <BulletinButton
            body={body || "No description"}
            title={title || "Untitled"}
          />

          <p
            class="mt-6 w-[12rem] min-w-[12rem] self-center text-sm italic text-label"
          >
            People can expand your bulletin to see the full title and
            description.
          </p>
        </div>
      </div>
    </div>

    <label class="label prefer-w-96 mt-6 flex flex-col self-center">
      <p>Click to create your bulletin:</p>

      <button class="field" type="submit">Create Bulletin</button>
    </label>
  </form>
</CenterOnPage>
