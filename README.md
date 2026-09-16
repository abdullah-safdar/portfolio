This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Content editing (TinaCMS)

Blog posts (`content/writing/*.mdx`) and the home page's copy (`content/home.json`) are editable through a visual editor at `/admin`, instead of hand-editing those files.

- `yarn dev` now runs Tina's local content server alongside `next dev` — open `http://localhost:3000/admin` to edit locally.
- `yarn build` requires TinaCloud credentials to succeed: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and optionally `NEXT_PUBLIC_TINA_BRANCH` (see `.env.local.example`). Without them, `tinacms build` fails fast with a clear "Client not configured" error before `next build` ever runs.
- Get those values from an existing [app.tina.io](https://app.tina.io) project connected to this repo (Overview tab → Client ID, Tokens tab → a Read Only Token), and set them locally in `.env.local` (gitignored) and on the hosting provider for deploys.
- Editing through `/admin` on the deployed site writes changes back to this GitHub repo; a normal redeploy is what makes an edit go live.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
