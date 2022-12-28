<script lang="ts">
  import { faHtml5 } from "@fortawesome/free-brands-svg-icons"
  import { faFileText } from "@fortawesome/free-solid-svg-icons"
  import type { Attachment } from "@prisma/client"
  import Icon from "./Icon.svelte"
  import { fileToIcon, linkToIcon } from "./toIcon"

  export let object: File | Attachment | HTMLAnchorElement
  export let interactive = false
  export let preview = false

  $: href =
    "href" in object
      ? object.href
      : object instanceof Blob
      ? undefined
      : object.type == "Link"
      ? object.content
      : undefined
</script>

<svelte:element
  this={interactive ? "a" : "p"}
  class="field block justify-start overflow-hidden text-ellipsis whitespace-nowrap text-left"
  class:degroup={preview &&
    (href?.includes("docs.google.com/document") ||
      href?.includes("docs.google.com/presentation") ||
      href?.includes("docs.google.com/spreadsheets"))}
  href={object instanceof Blob
    ? URL.createObjectURL(object)
    : "href" in object
    ? object.href
    : object.type == "File"
    ? `/uploads/${object.content}`
    : object.type == "Link"
    ? object.content
    : object.type == "Html"
    ? "data:text/html," + object.content
    : "data:text/plain," + object.content}
  target="_blank"
  rel="noopener noreferrer nofollow"
>
  <Icon
    isLabel
    icon={object instanceof Blob
      ? fileToIcon(object.type)
      : "href" in object
      ? linkToIcon(object.href)
      : object.type == "File"
      ? fileToIcon(object.label)
      : object.type == "Link"
      ? linkToIcon(object.content)
      : object.type == "Html"
      ? faHtml5
      : faFileText}
  />

  {object instanceof Blob
    ? object.name
    : "href" in object
    ? object.textContent
    : object.type == "File"
    ? object.label
    : object.type == "Link"
    ? object.label
    : object.type == "Html"
    ? object.label || "HTML document"
    : object.label || "Plain text document"}
</svelte:element>
