# Documentation

Hey! Welcome to kama sona, an enterprise-class, open source, and free platform
for managing groups, resources, and assignments. This repository and its files
have a lot of useful components and CSS classes in them that you won't know
unless you spend hours perusing through the source files. However, this file
compiles it all into an easily readable document. Without further ado, here we
go.

## Fields

<img align="right" alt="An example of `.field`." src="field-light.png" vspace="8" width="348" />

Interfaces are littered with fields. Search bars, inputs, buttons, and
dropdowns. To keep from copy-pasting Tailwind utilities everywhere, we've made a
CSS class that encloses all the styles necessary for a field: `.field`. It
normalizes all kinds of fields, whether they be inputs, textareas, buttons, or
dropdowns.

<img align="left" alt="An example of `.field`." src="field-dark.png" vspace="8" width="348" />

Of course, different types of elements have different purposes. That's why
`.field` makes sure to treat each element for its unique needs. Buttons and
links are centered, as they're often used for similar purposes, but textareas
and inputs are left aligned, as it provides a better user experience when the
content isn't shifting as they type. Additionally, textareas are vertically
resizable by default. And did I forget to mention it also styles placeholders in
textareas and input fields? My bad.

And let's not forget hover and focus styles, as they make up a core part of
navigating an app with keyboard and mouse. `.field` takes care of this by
providing a beautiful focus style using a blue border and ring. It also applies
a hover style by lightening the background and border of a given element. And by
only applying hover styles to links and buttons, we give users a clue as to what
can be clicked and what is just an input field.

#### Active Fields

If you have eyes, you will notice that some of the fields have a blue
background. These elements are marked as "active." Active elements are commonly
used in filters, but you might find uses for them elsewhere. To mark a field as
active, add the `.active` class to it. This should be in addition to the
`.field` class.

Finally, other components also try to match the styles of `.field`. For
instance, [RichTextArea](#richtextarea) matches the background and border styles
