<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
  import { PUBLIC_KS_MAX_UPLOAD_SIZE } from "$env/static/public"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Icon from "$lib/Icon.svelte"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LabelHelp from "$lib/LabelHelp.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import LinkWithEmbed from "$lib/LinkWithEmbed.svelte"
  import MultiSelect, { type SelectItem } from "$lib/MultiSelect.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faPercent,
    faQuestionCircle,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import type { Editor } from "@tiptap/core"
  import type { PageData } from "./$types"

  export let data: PageData

  const today = new Date()

  const todayAsString = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`

  let disabled = false
  let due = ""
  let title = ""
  let viewableAfter = todayAsString
  let selectedGroups: SelectItem[] = []
  let points = 0
  let files: FileList | null
  let willCreateCategory = false
  let description: Editor | undefined
  let newCategoryWeight = 1
  let selectedCategory = ""
  $: descriptionLinks = description?.options.element.getElementsByTagName("a")

  $: categories = data.groups
    .filter((group) => selectedGroups.some(({ value }) => value == group.id))
    .flatMap((group) => group.categories)
    .filter(
      (me, myIndex, a) =>
        a.findIndex((category) => category.id == me.id) == myIndex
    )

  const maxSize = Number.isSafeInteger(+PUBLIC_KS_MAX_UPLOAD_SIZE)
    ? Math.max(+PUBLIC_KS_MAX_UPLOAD_SIZE, 0)
    : 0
</script>

<Title mode="head-only" title="Create an Assignment" />

<CenterOnPage>
  {#if !data.isAllowed}
    <p class="prefer-w-96">You don't have permission to create assignments.</p>
  {:else if data.groups.length == 0}
    <p class="prefer-w-96">
      You must be the manager of a group in order to create assignments.
    </p>
  {:else}
    <div class="prefer-w-96 lg:prefer-w-[1280px]">
      <form
        class="flex w-full flex-col"
        method="post"
        on:submit={() => (disabled = true)}
        use:enhance
      >
        <textarea
          class="hidden"
          name="links"
          value={[...(descriptionLinks || [])]
            .map((link) => `${link.href}\t${link.textContent || ""}`)
            .join("\n")}
        />

        <div class="flex flex-col lg:flex-row lg:gap-4">
          <div class="flex max-w-xs flex-col lg:prefer-w-80">
            <label class="label w-full">
              <p>Assignment title:</p>

              <input
                type="text"
                name="title"
                id="title"
                class="field w-full"
                maxlength="100"
                required
                bind:value={title}
              />
            </label>

            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label w-full">
              <p>Assign to:</p>

              <MultiSelect
                name="groups"
                required
                options={data.groups.map((group) => ({
                  label: group.title,
                  value: group.id,
                }))}
                strictHeight
                bind:items={selectedGroups}
              />
            </label>

            <label class="label w-full">
              <p>Viewable after:</p>

              <LabelHelp
                content="Students will only see this assignment on or after this date."
              />

              <input
                type="date"
                name="viewableAfter"
                id="viewableAfter"
                class="field w-full"
                required
                min={todayAsString}
                max="9999-12-31"
                bind:value={viewableAfter}
              />
            </label>

            <label class="label w-full">
              <p>Due date:</p>

              <LabelHelp
                content="Students will be required to submit this assignment before the provided date."
              />

              <input
                type="date"
                name="due"
                id="due"
                class="field w-full"
                required
                min={isNaN(Date.parse(viewableAfter))
                  ? todayAsString
                  : viewableAfter}
                max="9999-12-31"
                bind:value={due}
              />
            </label>

            <label class="label w-full">
              <p>Points:</p>

              <p
                class="help"
                data-tooltip="The number of points this assignment is worth."
              >
                <Icon icon={faQuestionCircle} />

                <span class="sr-only">
                  The number of points this assignment is worth.
                </span>
              </p>

              <input
                type="number"
                name="points"
                id="points"
                class="field w-full"
                required
                bind:value={points}
                min="0"
                max="1000"
                step="1"
              />
            </label>
          </div>

          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label
            class="label mt-4 max-w-[34rem] flex-col lg:mt-0 lg:flex lg:flex-1"
          >
            <p>{browser ? "Preview and description:" : "Description:"}</p>

            <RichTextArea
              class="lg:flex-1 lg:resize-none"
              bind:editor={description}
              placeholder="Type a description..."
              name="description"
            >
              <svelte:fragment slot="prelude">
                <label
                  class="mt-0 mb-2 border-0 pb-0"
                  for="title"
                  data-no-rta-focus
                >
                  <h1 class="mt-0 border-0 pb-0">
                    {title || "Assignment title"}
                  </h1>
                </label>

                <IconLabels class="mb-4">
                  <IconLabel
                    for="due"
                    content={isNaN(Date.parse(due))
                      ? "Unknown due date"
                      : toDateString(new Date(due), { local: true })}
                    icon={faCalendarCheck}
                    title="Due date:"
                  />

                  <IconLabel
                    content={selectedGroups[0]?.label || "Unknown group"}
                    icon={faUserGroup}
                    title="Published in group:"
                  />

                  {#if points != 0}
                    <IconLabel
                      for="points"
                      content="{points} point{points == 1 ? '' : 's'}"
                      icon={faPercent}
                      title="Number of points:"
                    />
                  {/if}
                </IconLabels>
              </svelte:fragment>
            </RichTextArea>
          </label>

          <div class="mt-4 flex max-w-xs flex-col lg:mt-0 lg:w-80 lg:flex-1">
            <label class="label w-full">
              <p>Assignment category:</p>

              {#if willCreateCategory || categories.length == 0}
                <input
                  type="text"
                  class="field block w-full"
                  name="newCategoryName"
                  maxlength="32"
                  required
                />
              {:else}
                <select
                  name="category"
                  class="field"
                  required
                  bind:value={selectedCategory}
                >
                  {#each categories as category (category.id)}
                    <option value={category.id}>
                      {category.title}
                    </option>
                  {/each}
                </select>
              {/if}
            </label>

            {#if categories.length == 0 || willCreateCategory}
              <label class="label w-full">
                <p>Category weight:</p>

                <LabelHelp
                  content="Assignments in a category with a larger weight count for a larger portion of a student's grade."
                />

                <input
                  required
                  type="number"
                  class="field block w-full"
                  min="0"
                  max="1000"
                  name="newCategoryWeight"
                  bind:value={newCategoryWeight}
                />
              </label>
            {/if}

            <input
              type="hidden"
              name="willCreateCategory"
              value={willCreateCategory || categories.length == 0}
            />

            {#if selectedGroups.length == 0}
              <p class="mt-1">Select a group before picking a category.</p>
            {:else if categories.length == 0}
              {#if selectedGroups.length == 1}
                <p class="mt-1">
                  {selectedGroups[0]?.label} doesn't have any associated categories,
                  so you are required to create a new category.
                </p>
              {:else}
                <p class="mt-1">
                  Your selected groups don't have any associated categories, so
                  you are required to create a new category.
                </p>
              {/if}
            {:else}
              <p class="mt-2">
                Or <button
                  type="button"
                  class="link"
                  on:click={() => (willCreateCategory = !willCreateCategory)}
                  >{willCreateCategory
                    ? "use an existing category"
                    : "create a new category"}</button
                >.
              </p>
            {/if}

            <span class="h-4" />

            {#if PUBLIC_KS_MAX_UPLOAD_SIZE != "0"}
              <label class="label mt-auto w-full">
                <p>
                  Upload files (max size {maxSize < 1e3
                    ? `${maxSize} byte${maxSize == 1 ? "" : "s"}`
                    : maxSize < 1e6
                    ? `${Math.round(maxSize / 1e2) / 10} KB`
                    : maxSize < 1e9
                    ? `${Math.round(maxSize / 1e5) / 10} MB`
                    : maxSize < 1e12
                    ? `${Math.round(maxSize / 1e8) / 10} GB`
                    : maxSize < 1e15
                    ? `${Math.round(maxSize / 1e11) / 10} TB`
                    : maxSize < 1e18
                    ? `${Math.round(maxSize / 1e14) / 10} PB`
                    : "slightly less than infinity"}):
                </p>

                <input
                  type="file"
                  name="files"
                  class="field w-full"
                  multiple
                  bind:files
                  on:input={(event) => {
                    const totalSize = [...(event.currentTarget.files || [])]
                      .map((file) => file.size)
                      .reduce((a, b) => a + b, 0)

                    if (totalSize > maxSize) {
                      event.currentTarget.setCustomValidity(
                        "Your files are too large."
                      )
                    } else {
                      event.currentTarget.setCustomValidity("")
                    }
                  }}
                />
              </label>

              {#if files && files.length != 0}
                <div class="field-group label mt-4">
                  <p>Uploaded files:</p>

                  {#each files as file}
                    <LinkedObject object={file} />
                  {/each}
                </div>
              {/if}
            {/if}

            {#if descriptionLinks && descriptionLinks.length != 0}
              <div class="field-group label mt-4">
                <p>Detected links:</p>

                {#each descriptionLinks as link}
                  <LinkWithEmbed
                    href={link.href}
                    title={link.textContent || ""}
                  />
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <label class="label mt-4 w-full lg:mx-auto lg:prefer-w-96">
          <p>Click to create your assignment:</p>

          <button class="field w-full" type="submit" {disabled}>
            Create {browser && points == 0 ? "Ungraded" : ""} Assignment
          </button>
        </label>
      </form>
    </div>
  {/if}
</CenterOnPage>
