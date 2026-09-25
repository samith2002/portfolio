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

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com, choose **Add New → Project** and import the repo. Leave every default as is.
3. After the first deploy, set `profile.siteUrl` in `src/content.ts` to your real domain so social previews resolve correctly.

Or from the terminal: `npx vercel` (preview) / `npx vercel --prod`.
