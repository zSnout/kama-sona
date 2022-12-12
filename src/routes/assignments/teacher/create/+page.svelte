<script lang="ts">
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Icon from "$lib/Icon.svelte"
  import Title from "$lib/Title.svelte"
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import { onMount } from "svelte"
  import type { PageData } from "./$types"

  let disabled = false
  let due = ""
  let viewableAfter = ""
  let groupSelector: HTMLSelectElement

  export let data: PageData

  onMount(() => {
    if (!groupSelector.value) {
      groupSelector.setCustomValidity("Please select a group.")
    }
  })
</script>

<Title mode="head-only" title="Create an Assignment" />

<CenterOnPage>
  <div class="prefer-w-96">
    {#if data.groups.length == 0}
      <p>
        You must be the manager of a group in order to create an assignment.
      </p>
    {:else}
      <form
        class="flex w-full flex-col"
        method="post"
        use:enhance
        on:submit={() => (disabled = true)}
      >
        <label class="label w-full">
          <p>Assignment title:</p>

          <input type="text" name="title" class="field w-full" required />
        </label>

        <label class="label w-full">
          <p>Assign to:</p>

          <select
            class="field"
            required
            name="group"
            bind:this={groupSelector}
            on:input={() => {
              if (groupSelector.value) {
                groupSelector.setCustomValidity("")
              } else {
                groupSelector.setCustomValidity("Please select a group.")
              }
            }}
          >
            <option value="" disabled selected>Select a group...</option>

            {#each data.groups as group}
              <option value={group.id}>{group.name}</option>
            {/each}
          </select>
        </label>

        <label class="label w-full">
          <p>Due date:</p>

          <p
            class="help tooltip before:content-['Students_must_submit_this_assignment_BEFORE_8am_on_this_date.']"
          >
            <Icon icon={faQuestionCircle} />

            <span class="sr-only">
              Students must submit this assignment BEFORE 8am on this date.
            </span>
          </p>

          <input
            type="date"
            name="title"
            class="field w-full"
            required
            bind:value={due}
            min={new Date().toISOString()}
          />
        </label>

        <label class="label w-full">
          <p>Viewable after:</p>

          <p
            class="help tooltip before:content-['Students_will_only_see_this_assignment_on_or_after_this_date.']"
          >
            <Icon icon={faQuestionCircle} />

            <span class="sr-only">
              Students will only see this assignment on or after this date.
            </span>
          </p>

          <input
            type="date"
            name="title"
            class="field w-full"
            required
            max={due}
            bind:value={viewableAfter}
          />
        </label>

        <label class="label w-full">
          <p>Click to create your assignment:</p>

          <button class="field w-full" type="submit" {disabled}>
            Create Assignment
          </button>
        </label>
      </form>
    {/if}
  </div>
</CenterOnPage>
