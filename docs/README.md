# Documentation

Hey! Welcome to kama sona, an enterprise-class, open source, and free platform
for managing groups, resources, and assignments. This repository and its files
have a lot of useful components and CSS classes in them that you won't know
unless you spend hours perusing through the source files. However, this file
compiles it all into an easily readable document. Without further ado, here we
go.

## Fields

<img align="right" alt="An example of `.field`." src="field-light.png" width="348" />

Interfaces are littered with fields. Search bars, inputs, buttons, and
dropdowns. To keep from copy-pasting Tailwind utilities everywhere, we've made a
CSS class that encloses all the styles necessary for a field: `.field`. It
normalizes all kinds of fields, whether they be inputs, textareas, buttons, or
dropdowns. It even add proper hover and focus styling.

<img align="left" alt="An example of `.field`." src="field-dark.png" width="348" />

Of course, different types of elements have different purposes. That's why
`.field` makes sure to treat each element specially. Buttons and links are
centered, as they're often used for similar purposes, but textareas and inputs
are left aligned, as it provides a better user experience when the content isn't
shifting as they type. Additionally, textareas are vertically resizable by
default.
