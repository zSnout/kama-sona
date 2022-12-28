<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from "./Icon.svelte"

  export let content: string
</script>

<p class="help" data-tooltip={content}>
  <Icon icon={faQuestionCircle} />
  <span class="sr-only">{content}</span>
</p>
