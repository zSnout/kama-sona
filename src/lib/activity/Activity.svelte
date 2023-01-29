<script lang="ts" context="module">
  import { browser } from "$app/environment"

  export type PollData = {
    creation: string | Date
    id: string
    type: "Poll"
    title: string
    options: readonly {
      title: string
      votes: number
    }[]
    comments: readonly {
      author: string
      body: string
      vote: string | undefined
    }[]
    myVote: string | undefined
  }

  export type ArchiveData = {
    activities: readonly {
      creation: string | Date
      id: string
      title: string
    }[]
    id?: undefined
    type: "Archive"
  }

  export type NotSignedInData = {
    id?: undefined
    type: "NotSignedIn"
  }

  export type NoActivityData = {
    id?: undefined
    type: "NoActivity"
  }

  export type ActivityData =
    | PollData
    | ArchiveData
    | NotSignedInData
    | NoActivityData

  export type ActivityPost =
    | { type: "Archive:retrieve" }
    | { type: "Poll:comment"; body: string }
    | { type: "Poll:select"; optionTitle: string }
    | { type: "reload"; id: string }

  async function fetchData(): Promise<ActivityData> {
    try {
      const response = await fetch("/activity", { method: "get" })
      return await response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  let sharedData: Promise<ActivityData> | ActivityData

  if (browser) {
    sharedData = fetchData()
  }
</script>

<script lang="ts">
  import LoadingSpinner from "$lib/LoadingSpinner.svelte"
  import Archive from "./Archive.svelte"
  import Poll from "./Poll.svelte"

  let data = sharedData

  let className = ""
  export { className as class }

  let isLoading = false

  async function handlePost({ detail }: { detail: ActivityPost }) {
    isLoading = true

    const request = { id: (await data).id, ...detail }

    try {
      const response = await fetch("/activity", {
        method: "post",
        body: JSON.stringify(request),
      })

      if (response.status != 200) {
        sharedData = data = Promise.reject(
          `Received status code ${response.status} from server.`
        )

        return
      }

      sharedData = data = await response.json()
    } catch (error) {
      sharedData = data = Promise.reject(error)
    } finally {
      isLoading = false
    }
  }

  if (!data) {
    sharedData = data = fetchData()
  }
</script>

<div class="{className} x flex flex-1 flex-col">
  {#await data}
    <LoadingSpinner class="m-auto" />
  {:then awaitedData}
    <div
      class="flex-1 flex flex-col transition overflow-auto -ml-px pl-px -mr-px"
      class:opacity-30={isLoading}
    >
      {#if awaitedData.type == "Poll"}
        <Poll data={awaitedData} on:post={handlePost} />
      {:else if awaitedData.type == "Archive"}
        <Archive data={awaitedData} on:post={handlePost} />
      {:else if awaitedData.type == "NotSignedIn"}
        <p class="text-center m-auto px-3">
          You must be signed in to view today's activity.
        </p>
      {:else if awaitedData.type == "NoActivity"}
        <p class="text-center m-auto prefer-w-60">
          Weekends don't have activities, but you can <button
            class="underline underline-offset-2"
            on:click={() =>
              handlePost({ detail: { type: "Archive:retrieve" } })}
            >see old ones</button
          >.
        </p>
      {:else}
        <p class="px-3 py-4">
          Today's activity is of a new type: {String(
            // @ts-ignore
            awaitedData?.type
          )}. Refresh the page to view it.
        </p>
      {/if}
    </div>

    {#if isLoading}
      <div
        class="fixed top-16 bottom-0 right-0 left-[calc(100%_-_26.5rem)] flex justify-center items-center"
      >
        <LoadingSpinner />
      </div>
    {/if}
  {:catch reason}
    <div class="px-3 py-4">
      <p>
        An issue occurred while fetching today's activity. Try <button
          class="link"
          on:click={() => location.reload()}>reloading this page</button
        >.
      </p>

      <p>{reason}</p>
    </div>
  {/await}
</div>
