<script lang="ts">
  import { browser } from "$app/environment"
  import {
    faBold,
    faCode,
    faHeading,
    faItalic,
    faLink,
    faLinkSlash,
    faListOl,
    faListUl,
    faQuoteLeft,
    faStrikethrough,
    faUnderline,
  } from "@fortawesome/free-solid-svg-icons"
  import { Editor } from "@tiptap/core"
  import { Highlight } from "@tiptap/extension-highlight"
  import { Link } from "@tiptap/extension-link"
  import { Typography } from "@tiptap/extension-typography"
  import { Underline } from "@tiptap/extension-underline"
  import StarterKit from "@tiptap/starter-kit"
  import { onDestroy, onMount } from "svelte"
  import RichTextAreaButton from "./RichTextAreaButton.svelte"

  export let name = ""
  export let placeholder = ""
  export let readonly = false
  export let value = ""

  let className = ""
  export { className as class }

  export let editor: Editor | undefined = undefined
  let element: HTMLElement | undefined

  onMount(() => {
    if (!element) {
      return
    }

    editor = new Editor({
      element,
      editable: !readonly,
      extensions: [
        StarterKit,
        Link.configure({
          autolink: true,
          protocols: ["http", "https", "mailto", "tel"],
          linkOnPaste: true,
          openOnClick: false,
          HTMLAttributes: {
            "data-tooltip": "%href%",
          },
        }),
        Highlight,
        Typography,
        Underline,
      ],
      content: value,
      onTransaction: () => {
        editor = editor
      },
    })

    editor.on("update", ({ editor }) => {
      value = editor.getHTML()
    })
  })

  onDestroy(() => {
    editor?.destroy()
  })

  const chain = () => editor?.chain().focus()

  function toggleLink() {
    if (!editor) {
      return
    }

    if (editor.isActive("link")) {
      chain()?.unsetLink().run()
    } else {
      let _href = prompt("What do you want to link to?")

      if (!_href) {
        return
      }

      if (!/^https?:/.test(_href)) {
        _href = "http://" + _href
      }

      const href = _href
      let hadSelection = true

      chain()
        ?.extendMarkRange("link")
        .command(({ chain, tr }) => {
          if (tr.selection.empty) {
            hadSelection = false

            return chain()
              .insertContent({
                type: "text",
                text: href,
                marks: [{ type: "link" }],
              })
              .extendMarkRange("link")
              .run()
          }

          return true
        })
        .setLink({ href })
        .command(({ commands, tr }) => {
          if (!hadSelection) {
            return commands.setTextSelection({
              from: tr.selection.to,
              to: tr.selection.to,
            })
          }

          return true
        })
        .run()
    }
  }
</script>

{#if readonly}
  <div
    class="field rta prose flex flex-1 cursor-text select-text flex-col"
    style:--placeholder={(editor?.getText().trim() == "" &&
      editor.getHTML().startsWith("<p>") &&
      `"${placeholder}"`) ||
      null}
  >
    <div class="cursor-default">
      <slot name="prelude" />
    </div>

    {@html value}
  </div>
{:else}
  <textarea
    class="{className} field min-h-[16rem]"
    class:degroup={browser}
    class:sr-only={browser}
    class:w-full={!browser}
    {name}
    {placeholder}
    bind:value
  />

  {#if browser}
    <div class="field min-h-[16rem] overflow-auto md:flex-1" aria-hidden="true">
      <!-- #region buttons -->

      <div
        class="sticky -top-2 z-20 -mx-3 -mt-2 -mb-1 flex overflow-x-auto border-b border-gray-300 bg-white p-1 transition scrollbar:hidden dark:border-slate-600 dark:bg-slate-850"
      >
        <RichTextAreaButton
          action={({ detail }) =>
            (detail == 1 && editor?.isActive("heading")) || detail >= 3
              ? chain()?.setParagraph().run()
              : chain()
                  ?.setHeading({ level: detail == 2 ? 2 : 1 })
                  .run()}
          active={editor?.isActive("heading")}
          icon={faHeading}
          title="Toggle heading"
          tooltip="Start a line with hashtags:
# level 1 heading
## level 2 heading"
        />

        <RichTextAreaButton
          action={() => chain()?.toggleBold().run()}
          active={editor?.isActive("bold")}
          icon={faBold}
          title="Toggle bold"
          tooltip="Surround text with doubled asterisks:
**bolded text**"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          icon={faItalic}
          title="Toggle italics"
          tooltip="Surround text with underscores:
_italicized text_"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleUnderline().run()}
          active={editor?.isActive("underline")}
          icon={faUnderline}
          title="Toggle underline"
          tooltip="You really shouldn't use underlines."
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
          icon={faStrikethrough}
          title="Toggle strikethrough"
          tooltip="Surround text with doubled tildes:
~~some text~~"
        />

        <RichTextAreaButton
          action={toggleLink}
          active={editor?.isActive("link")}
          icon={editor?.isActive("link") ? faLinkSlash : faLink}
          title="Create a link"
          tooltip="Type or paste a URL:
https://example.com/"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code")}
          icon={faCode}
          title="Toggle monospace"
          tooltip="Surround text with backticks:
`monospaced text`"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          icon={faListUl}
          title="Toggle a bulleted list"
          tooltip="Start each line of a list with a dash:
- list item
- another list item"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          icon={faListOl}
          title="Toggle a numbered list"
          tooltip="Start each line of a numbered list with a number:
1. list item 1
2. list item 2"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          icon={faQuoteLeft}
          title="Toggle a quotation"
          tooltip="Start lines with a >:
> some quotation"
        />

        <RichTextAreaButton
          action={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={editor?.isActive("codeBlock")}
          icon={faCode}
          title="Toggle a code block"
          tooltip="Surround paragraphs with three backticks:
```
line 1 of my program
line 2 of my program
```"
        />
      </div>

      <!-- #endregion buttons -->

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        bind:this={element}
        class="rta prose flex flex-1 cursor-text select-text flex-col pt-3"
        style:--placeholder={(editor?.getText().trim() == "" &&
          editor.getHTML().startsWith("<p>") &&
          `"${placeholder}"`) ||
          null}
        style:min-height="calc(100% - 2rem)"
        on:mousedown={() =>
          requestAnimationFrame(() => editor?.commands.focus())}
        on:click={() => requestAnimationFrame(() => editor?.commands.focus())}
        on:click={(event) => {
          if (event.target instanceof HTMLAnchorElement) {
            event.stopPropagation()
          }
        }}
      >
        <div class="cursor-default">
          <slot name="prelude" />
        </div>
      </div>
    </div>
  {/if}
{/if}
