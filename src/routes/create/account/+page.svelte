<script lang="ts">
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import MultiSelect from "$lib/MultiSelect.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  let disabled = false
</script>

<CenterOnPage>
  <div class="prefer-w-96 lg:prefer-w-3xl">
    <form
      class="flex w-full flex-col"
      method="post"
      on:submit={() => (disabled = true)}
      use:enhance
    >
      <div class="flex flex-col lg:flex-row lg:gap-4">
        <div class="prefer-w-96 flex flex-col">
          <label class="label w-full">
            <p>Full name:</p>

            <input class="field w-full" name="name" type="text" required />
          </label>

          <label class="label w-full">
            <p>Email address:</p>

            <input
              class="field w-full"
              name="email"
              type="email"
              autocomplete="off"
              required
            />
          </label>

          <label class="label w-full">
            <p>Click to create the account:</p>

            <button class="field w-full" type="submit" {disabled}>
              Create Account
            </button>
          </label>
        </div>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label prefer-w-96 flex flex-1 flex-col">
          <p>Grant permissions:</p>

          <MultiSelect
            class="flex-1"
            name="permission"
            options={data.permissions}
          />
        </label>
      </div>
    </form>
  </div>
</CenterOnPage>
