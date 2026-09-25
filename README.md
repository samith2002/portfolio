# Samith Siddo — Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4. Every page is prerendered as static HTML, so it runs on Vercel's free tier with no config.

## Edit content
- `src/content.ts`: bio, metrics, work, projects, Prompt Weaver demo videos, experience, toolkit and links.
- `src/posts/*.tsx`: blog posts. Titles, dates and descriptions are in `src/posts/index.ts`, and figures are in `src/posts/_figures/`.
- `src/components/illustrations/`: the animated project illustrations.
- `public/`: your portrait (`samith.jpg`), résumé PDF and Prompt Weaver images (`pw/`).

To add a post, create `src/posts/my-post.tsx` and register it in `src/posts/index.ts`.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build check
```

## Deploy
The Vercel project `samith-portfolio` is connected to this repo:

- **Push to `main`** and the site deploys to production at https://samithsiddo.com.
- **Push any other branch** to get a preview URL.

Manual deploy from this folder, if needed: `npx vercel deploy --prod`.
