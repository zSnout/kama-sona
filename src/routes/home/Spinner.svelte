<script lang="ts">
  import BigButtonColored from "$lib/BigButtonColored.svelte"
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

  let isShown = false

  let className = "flex items-center justify-center"
  export { className as class }

  export let tooltip: string
  export let translate = "0,0"

  export let items: readonly {
    color: "red" | "orange" | "yellow" | "green" | "blue" | "purple"
    href: string
    icon: IconDefinition
    title: string
  }[]

  $: size = items.length == 5 ? 10 : 12
</script>

<svelte:window
  on:keydown={(event) => {
    if (
      isShown &&
      event.key == "Escape" &&
      !event.altKey &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      isShown = false
      event.preventDefault()
    }
  }}
/>

<div
  class="absolute -inset-y-6 -inset-x-8 hidden backdrop-blur-lg transition duration-500 lg:block"
  class:pointer-events-none={!isShown}
  class:opacity-0={!isShown}
  class:z-30={!isShown}
  class:z-40={isShown}
/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="hidden h-[34rem] w-[34rem] items-center justify-center self-center justify-self-center rounded-full lg:flex"
  style:grid-column-start="2"
  style:grid-column-end="3"
  style:grid-row-start="3"
  style:grid-row-end="4"
  class:pointer-events-none={!isShown}
  class:z-30={!isShown}
  class:z-40={isShown}
  style="transform:translate({translate})"
  on:mouseleave={() => (isShown = false)}
>
  <button
    class="group pointer-events-auto h-12 w-12 cursor-pointer {className} rounded-lg border p-1 outline-none transition before:whitespace-nowrap"
    class:big-button-bg={!isShown}
    class:big-button-border={!isShown}
    class:big-button-hover-bg={isShown}
    class:big-button-hover-border={isShown}
    class:before:opacity-100={isShown}
    class:before:scale-100={isShown}
    data-tooltip={tooltip}
    on:click={() => (isShown = !isShown)}
    on:mouseover={() => (isShown = true)}
  >
    <slot name="icon" />
  </button>

  {#each items as item, index}
    {@const angle = index * (360 / items.length)}

    {@const reverseAngle =
      angle < 45
        ? 0
        : angle < 135
        ? 270
        : angle < 225
        ? 180
        : angle < 315
        ? 90
        : 0}

    {@const delay = index * 50}

    <BigButtonColored
      class="home-big-button absolute top-1/2 left-1/2 flex w-32 {isShown
        ? 'active'
        : 'pointer-events-none opacity-0'}"
      style="--angle: {angle}deg; --reverse-angle: {reverseAngle}deg; --delay: {delay}ms; --size: -{size}rem"
      color={item.color}
      href={item.href}
      icon={item.icon}
      label={item.title}
    />
  {/each}
</div>
