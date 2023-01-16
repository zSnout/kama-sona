<script lang="ts">
  import { help } from "$lib/help"
  import IconLabel from "$lib/IconLabel.svelte"
  import IconLabels from "$lib/IconLabels.svelte"
  import LargeTitle from "$lib/LargeTitle.svelte"
  import LinkedObject from "$lib/LinkedObject.svelte"
  import Title from "$lib/Title.svelte"
  import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ resource } = data)
  $: group = resource.groups[0]
  $: files = resource.attachments.filter((e) => e.type == "File")
  $: links = resource.attachments.filter((e) => e.type == "Link")
</script>

<Title mode="head-only" title={resource.title} />

<div class="flex flex-1 flex-col gap-8 lg:flex-row">
  <div class="top-22 flex flex-1 flex-col self-start lg:sticky">
    <div class="prose max-w-prose">
      <LargeTitle>{resource.title}</LargeTitle>

      <IconLabels class="mb-4">
        <IconLabel
          content={group?.title || "Unknown group"}
          href={group && `/group/${group.id}`}
          icon={faUserGroup}
          title="Published in group:"
        />
      </IconLabels>

      {@html resource.description}
    </div>

    {#if files.length > 0 || links.length > 0}
      <div class="mt-12 flex w-full flex-col gap-6 sm:flex-row md:gap-4">
        {#if files.length > 0}
          <div class="flex-1">
            <p class="mb-2">Attachments:</p>

            <div class="field-group max-w-xs">
              {#each files as file}
                <LinkedObject interactive object={file} />
              {/each}
            </div>
          </div>
        {/if}

        {#if links.length > 0}
          <div class="flex-1">
            <p class="mb-2">Links:</p>

            <div class="field-group max-w-xs">
              {#each links as link}
                <LinkedObject interactive object={link} />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<div hidden use:help>
  <p>This page is a resource.</p>

  <p>It includes a</p>

  <ul>
    <li>title,</li>
    <li>group,</li>
    <li>description, and</li>
    <li>attachments.</li>
  </ul>
</div>
