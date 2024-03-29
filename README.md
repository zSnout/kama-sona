# kama sona

An enterprise-class, open source, and free platform for managing groups,
resources, and assignments.

> **Note** We use
> [a Google Doc](https://docs.google.com/document/d/1ekZaoOcr6nrLGeR6PFVRed5BuH1-jsKsvyCgS0tYdRU/edit)
> to take notes and plan quickly. It's publicly viewable if you want to take a
> look.

## Developing

> **Note** If you want to develop for kama sona, _please_ first look at the
> [developer documentation](docs). It's very useful and will save you a lot of
> time and confusion.

To work on kama sona, first download the repository from GitHub.

```bash
git clone https://github.com/zSnout/kama-sona
cd kama-sona
```

Then, install the dependencies with NPM and build Prisma Client.

```bash
npm install
npx prisma generate
```

Once those steps are done, you can run the development server.

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of kama sona:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an
> [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
