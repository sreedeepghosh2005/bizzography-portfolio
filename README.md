# Bizzography portfolio

Portfolio site for Bizzography, a photography service.

Built with Next.js, TypeScript, Tailwind CSS and shadcn.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Change the content

- All text is in `lib/site-content.ts`. Lines marked `DRAFT` need the real details.
- Photos are in `public/photos/`. The tunnel uses `01.jpg` to `10.jpg`. The about section uses `portrait.jpg`.
- The logo is in `components/brand-logo.tsx`.

## Deploy to GitHub Pages

The site is a static export. Build it with the base path, then publish the `out` folder to the `gh-pages` branch.

```bash
NEXT_PUBLIC_BASE_PATH=/bizzography-portfolio npm run build
```
