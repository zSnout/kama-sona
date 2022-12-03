# kama sona

An enterprise-class, open source, and free platform for managing groups,
resources, and assignments.

## Developing

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
