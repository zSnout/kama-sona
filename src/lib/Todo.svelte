<script lang="ts">
  import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte-local-storage-store"
  import Checkbox from "./Checkbox.svelte"
  import Icon from "./Icon.svelte"

  let className = ""
  export { className as class }

  export let borderless = false
  export let style = ""

  interface Todo {
    readonly id: number
    readonly text: string
    readonly done: boolean
  }

  const todos = writable<readonly Todo[]>("todo", [])

  let newTodo = ""
  let newTodoEl: HTMLInputElement | undefined
</script>

<div class="{className} flex flex-col bg-field" {style}>
  <form
    class="-mx-px -mt-px flex"
    on:submit={() => {
      if (!newTodo.trim()) {
        return
      }

      todos.update((value) =>
        value.concat({
          id: Math.floor(Math.random() * 1e9),
          text: newTodo,
          done: false,
        })
      )

      newTodo = ""

      setTimeout(() => newTodoEl?.focus(), 10)
    }}
  >
    <input
      class="field relative -mr-px min-w-0 flex-1 rounded-r-none rounded-bl-none shadow-none focus:z-10"
      class:rounded-none={borderless}
      type="text"
      placeholder="Type a new item..."
      bind:value={newTodo}
      bind:this={newTodoEl}
    />

    <button
      class="field relative rounded-l-none rounded-br-none shadow-none focus:z-10"
      class:rounded-none={borderless}
      type="submit"
    >
      <Icon class="h-4 w-4" icon={faPlus} />
    </button>
  </form>

  <div class="flex max-h-full flex-1 flex-col overflow-auto px-3 py-2">
    {#each $todos as todo}
      <div class="group flex" class:line-through={todo.done}>
        <Checkbox
          action={() =>
            todos.update(($todos) =>
              $todos.map(($todo) =>
                $todo.id == todo.id ? { ...$todo, done: !$todo.done } : $todo
              )
            )}
          checked={todo.done}
        >
          {todo.text}
        </Checkbox>

        <button
          on:click={() =>
            todos.update(($todos) =>
              $todos.filter(($todo) => $todo.id != todo.id)
            )}
          class="scale-75 text-transparent transition duration-300 group-hover:scale-100 group-hover:text-current group-hover:duration-[0s]"
        >
          <Icon class="h-4 w-4" icon={faTrash} />
        </button>
      </div>
    {:else}
      <div class="m-auto prefer-w-44 text-center">
        Yay! You have nothing on your to do list.
      </div>
    {/each}
  </div>
</div>
