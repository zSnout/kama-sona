# Documentation

Hey! Welcome to kama sona, an enterprise-class, open source, and free platform
for managing groups, resources, and assignments. This repository and its files
have a lot of useful components and CSS classes in them that you won't know
unless you spend hours perusing through the source files. However, this file
compiles it all into an easily readable document. Without further ado, here we
go.

## Fields

<img align="right" alt="An example of `.field`." src="field-light.png" vspace="8" width="348" />

If you're trying to make a button, input field, or dropdown, use `.field`. It
adds background, border, hover, and focus styles for many types of elements. It
also makes textareas vertically resizable, handles placeholder colors, and works
well in dark mode.

<img align="left" alt="An example of `.field`." src="field-dark.png" vspace="8" width="348" />

It also has a sibling class called `.active`, which makes the background and
border blue to mark the element as "activated." This can be used for filters and
checkboxes.

### Components

`.field` uses a border style of `border-slate-300 dark:border-slate-600`, which
is aliased to `border-standard` for convenience. These borders are dark enough
to show up when needed, but aren't intrusive to the user experience. To match
the border and ring styles of `.field` when an element is focused, add
`.ring-color` to your elements. To match them even when an element isn't
focused, use `.ring-color-initial`. You'll also need to add the `ring` class at
the appropriate time.

## Links

<img align="right" alt="An example of `.link`." src="link-dark.png" vspace="8" width="140" />

<img align="right" alt="An example of `.link`." src="link-light.png" vspace="8" width="140" />

To style links, add the `.link` class to them. It makes an element blue and
shows an underline upon hovering or focusing. It can also be used on buttons. To
keep the underline styles but omit the blue color, use `.link-colorless`.

## Tooltips

<img align="left" alt="An example of `data-tooltip`." src="tooltip-light.png" vspace="8" />

<img align="left" alt="An example of `data-tooltip`." src="tooltip-dark.png" vspace="8" />

To show text when an element is hovered over, add the `data-tooltip` attribute
to it. It makes the applied element `position: relative` and adds content in the
`::before` pseudo element. The tooltip respects the current text color.

## Focus States

When making focus states, use the `focus:` Tailwind modifier. It automatically
combines `:focus-visible` and `:focus-within`, which is the preferred behavior
in most circumstances. Specifically, it matches
`&:focus-visible, &:focus-within:not(:focus)`.
