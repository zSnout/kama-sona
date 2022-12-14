<script lang="ts">
  export let name: string | undefined = undefined
  export let options: string[] = []
  export let placeholder = ""
  export let value = ""

  let id = "combobox-" + Math.random().toString().slice(2)
</script>

<input type="text" bind:value list={id} {name} {placeholder} />

<datalist {id}>
  {#each options as option}
    <option value={option} />
  {/each}
</datalist>
