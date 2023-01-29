<script lang="ts">
  import type { BulletinItem } from "./Bulletin.svelte"

  export let item: BulletinItem

  let el: HTMLButtonElement
  let isFixed = false
  let isModal = false
  // let active = false

  // function set() {
  //   el.style.position = "fixed"
  //   el.style.minWidth = "0"
  //   el.style.minHeight = "0"
  //   el.style.width = "auto"
  //   el.style.height = "auto"
  // }

  // function position(rect: Pick<DOMRect, "left" | "bottom" | "right" | "top">) {
  //   el.style.top = `${rect.top}px`
  //   el.style.right = `${innerWidth - rect.right}px`
  //   el.style.bottom = `${innerHeight - rect.bottom}px`
  //   el.style.left = `${rect.left}px`
  //   el.style.transform = "none"
  // }

  // function frame() {
  //   return new Promise<number>((resolve) => requestAnimationFrame(resolve))
  // }

  // async function animate(to: "bar" | "modal") {
  //   el.style.transitionDuration = "0s"
  //   el.style.transitionProperty = "none"

  //   await tick()
  //   await frame()

  //   const start = el.getBoundingClientRect()

  //   console.log(start)

  //   showAsModal = to === "modal"
  //   await tick()
  //   const end = el.getBoundingClientRect()

  //   console.log(end)

  //   showAsModal = false
  //   await tick()

  //   set()
  //   await frame()
  //   position(start)
  //   el.style.transitionProperty = "top, right, bottom, left"
  //   el.style.transitionDuration = "500ms"
  //   el.style.zIndex = "60"

  //   await frame()
  //   position(end)
  // }
</script>

<svelte:window />

<button
  bind:this={el}
  on:click={() => {
    stage = !stage

    if (stage) {
      requestAnimationFrame(() => requestAnimationFrame(() => (ticked = true)))
    }
  }}
  class="flex flex-col rounded-lg px-3 py-2 text-left shadow-md transition-all duration-[5s] bg-field {stage
    ? 'fixed top-1/2 left-1/2 z-40 h-[28rem] w-80 min-w-[20rem] -translate-y-1/2 -translate-x-1/2'
    : 'h-[10.5rem] w-[12rem] min-w-[12rem]'}"
>
  <p class="mb-1 line-clamp-1">{item.title}</p>

  <p class="text-sm line-clamp-6">{item.body}</p>
</button>
