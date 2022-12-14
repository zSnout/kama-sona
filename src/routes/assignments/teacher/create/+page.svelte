<script lang="ts">
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"
  import CenterOnPage from "$lib/CenterOnPage.svelte"
  import Icon from "$lib/Icon.svelte"
  import { fileToIcon, linkToIcon } from "$lib/toIcon"
  import MultiSelect, { type SelectItem } from "$lib/MultiSelect.svelte"
  import RichTextArea from "$lib/RichTextArea.svelte"
  import Title from "$lib/Title.svelte"
  import { toDateString } from "$lib/toDateString"
  import {
    faCalendarCheck,
    faFile,
    faLink,
    faPercent,
    faQuestionCircle,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons"
  import type { Editor } from "@tiptap/core"
  import type { PageData } from "./$types"

  export let data: PageData

  let disabled = false
  let due = ""
  let title = ""
  let viewableAfter = ""
  let selectedGroups: SelectItem[] = []
  let points = 0
  let files: FileList
  let description: Editor | undefined
  $: descriptionLinks = description?.options.element.getElementsByTagName("a")

  const today = new Date()

  const todayAsString = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
</script>

<Title mode="head-only" title="Create an Assignment" />

<CenterOnPage>
  {#if data.groups.length == 0}
    <p class="prefer-w-96">
      You must be the manager of a group in order to create an assignment.
    </p>
  {:else}
    <div class="prefer-w-96 md:prefer-w-[768px] lg:prefer-w-[1280px]">
      <form
        class="flex w-full flex-col"
        method="post"
        on:submit={() => (disabled = true)}
        use:enhance
      >
        <div class="flex flex-col md:flex-row md:gap-4">
          <div class="flex max-w-xs flex-col md:prefer-w-80">
            <label class="label w-full">
              <p>Assignment title:</p>

              <input
                type="text"
                name="title"
                class="field w-full"
                required
                bind:value={title}
              />
            </label>

            <!--
              svelte-ignore a11y-label-has-associated-control <MultiSelect> has
              an input field that Svelte can't see.
            -->
            <label class="label w-full">
              <p>Assign to:</p>

              <MultiSelect
                name="groups"
                required
                options={data.groups.map((group) => ({
                  label: group.name,
                  value: group.id,
                }))}
                bind:items={selectedGroups}
              />
            </label>

            <label class="label w-full">
              <p>Viewable after:</p>

              <p
                class="help"
                data-tooltip="Students will only see this assignment on or after this date."
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
                min={todayAsString}
                bind:value={viewableAfter}
              />
            </label>

            <label class="label w-full">
              <p>Due date:</p>

              <p
                class="help"
                data-tooltip="Students will be required to submit this assignment before
                8am on this date."
              >
                <Icon icon={faQuestionCircle} />

                <span class="sr-only">
                  Students will be required to submit this assignment before 8am
                  on this date.
                </span>
              </p>

              <input
                type="date"
                name="title"
                class="field w-full"
                required
                bind:value={due}
                min={isNaN(Date.parse(viewableAfter))
                  ? todayAsString
                  : viewableAfter}
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
                class="field w-full"
                required
                bind:value={points}
                min="0"
                step="1"
              />
            </label>
          </div>

          <!--
            svelte-ignore a11y-label-has-associated-control <RichTextArea> has a
            textarea that Svelte can't see.
          -->
          <label
            class="label mt-4 max-w-[34rem] flex-col md:mt-0 md:flex md:flex-1"
          >
            <p>{browser ? "Preview and description:" : "Description:"}</p>

            <RichTextArea
              class="md:flex-1 md:resize-none"
              bind:editor={description}
              placeholder="Type a description..."
            >
              <svelte:fragment slot="prelude">
                <h1 class="mt-0 mb-2 border-0 pb-0">
                  {title || "Assignment title"}
                </h1>

                <div class="mb-4 flex flex-wrap gap-x-8 gap-y-1">
                  <p class="mb-0 whitespace-pre">
                    <Icon isLabel icon={faCalendarCheck} title="Due date:" />

                    {isNaN(Date.parse(due))
                      ? "Unknown"
                      : toDateString(new Date(due), { local: true })}
                  </p>

                  <p class="mb-0 whitespace-pre">
                    <Icon
                      isLabel
                      icon={faUserGroup}
                      title="Published in group:"
                    />

                    {selectedGroups[0]?.label || "Unknown"}
                  </p>

                  {#if points != 0}
                    <p class="mb-0 whitespace-pre">
                      <Icon
                        isLabel
                        icon={faPercent}
                        title="Number of points:"
                      />

                      {points} point{points == 1 ? "" : "s"}
                    </p>
                  {/if}
                </div>
              </svelte:fragment>
            </RichTextArea>
          </label>

          <div class="mt-4 max-w-xs flex-col md:mt-0 md:flex md:prefer-w-80">
            <label class="label w-full">
              <p>Upload files:</p>

              <input
                type="file"
                name="files"
                class="field w-full"
                multiple
                bind:files
              />
            </label>

            {#if files && files.length != 0}
              <div class="field-group label mt-4">
                <p>Uploaded files:</p>

                {#each files as file}
                  <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                    <Icon isLabel icon={fileToIcon(file.type)} />
                    {file.name}
                  </p>
                {/each}
              </div>
            {/if}

            {#if descriptionLinks && descriptionLinks.length != 0}
              <div class="field-group label mt-4">
                <p>Detected links:</p>

                {#each descriptionLinks as link}
                  <a
                    class="field block w-full overflow-hidden text-left"
                    href={link.href}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    type="button"
                  >
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      <Icon isLabel icon={linkToIcon(link.href)} />
                      {link.textContent}
                    </p>

                    {#if link.href.includes("docs.google.com")}
                      <p class="mt-1">
                        Check that your Google {link.href.includes(
                          "/presentation"
                        )
                          ? "Slides"
                          : link.href.includes("/spreadsheets")
                          ? "Sheets"
                          : link.href.includes("/forms")
                          ? "Form"
                          : "Doc"} is shared.
                      </p>
                    {/if}

                    {#if link.href.includes("docs.google.com/presentation")}
                      <iframe
                        class="pointer-events-none relative top-[1px] -mx-3 -mb-2 mt-2 aspect-video w-[calc(100%_+_1.5rem_+_2px)]"
                        src="https://docs.google.com/presentation{link.href.match(
                          /\/d\/([A-Za-z0-9\-\_]+)/
                        )?.[0]}/preview?rm=minimal&slide=1"
                        title="Embedded Google Slides presentation"
                      />
                    {:else if link.href.includes("docs.google.com/document")}
                      <iframe
                        class="pointer-events-none relative top-[1px] -mx-3 -mb-2 mt-2 aspect-square w-[calc(100%_+_1.5rem_+_2px)]"
                        src="https://docs.google.com/document{link.href.match(
                          /\/d\/([A-Za-z0-9\-\_]+)/
                        )?.[0]}/mobilebasic?rm=minimal"
                        title="Embedded Google Docs document"
                      />
                    {/if}
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <label class="label mt-4 w-full md:mx-auto md:prefer-w-96">
          <p>Click to create your assignment:</p>

          <button class="field w-full" type="submit" {disabled}>
            Create Assignment
          </button>
        </label>
      </form>
    </div>
  {/if}
</CenterOnPage>
