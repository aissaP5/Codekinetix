# SMASH'D — GSAP Burger Landing Page

Award-style dark landing page: GSAP 3 scroll animations, scroll-scrubbed video
frame sequence, Lenis smooth scroll, custom cursor, magnetic buttons, animated
preloader with curtain reveal.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **GSAP 3.15** (ScrollTrigger, DrawSVG)
- **Lenis** smooth scroll

## Run it locally

1. Install [Node.js 20+](https://nodejs.org) (or [Bun](https://bun.sh))
2. In this folder run:

```bash
npm install        # or: bun install
npm run dev        # or: bun run dev
```

3. Open http://localhost:3000

## Deploy it

- **Vercel** (easiest): push this folder to a GitHub repo → "Import Project" on
  vercel.com → deploy. Zero config needed.
- **Netlify**: `npm run build`, publish the `.next` folder with the Next plugin.
- Any Node host: `npm run build && npm run start`.

## Structure

```
src/
  app/                # Next.js App Router (layout, page, global styles)
  components/burger/  # all landing page components
    BurgerLanding.tsx # page orchestrator (Lenis + preloader flow)
    Preloader.tsx     # loader: line-art draw + counter + curtain wipe
    Hero.tsx          # your burger image, drop-in physics, 3D mouse tilt
    AnatomySection.tsx# scroll-scrubbed video (100 frames) + labels
    StackSection.tsx  # ingredient showcase
    StatsSection.tsx  # animated counters
    MenuSection.tsx   # menu with cursor-following previews
    Footer.tsx        # CTA + Order Now toast
    Marquee / Magnetic / CustomCursor / OrderToast
  lib/burger.ts       # data (menu items, layer config)
public/
  burger/             # hero render + menu photos
  scrub/              # 100 video frames (f_001..f_100.jpg) — the spin section
  menu/               # menu hover preview photos
```

## Customize

- **Menu items / prices**: `src/lib/burger.ts` → `MENU_ITEMS`
- **Colors**: `src/app/globals.css` → `:root` variables
  (`--ember`, `--gold`, `--smoke`, `--ink`…)
- **Ingredient labels**: `src/components/burger/AnatomySection.tsx` → `LABELS`
- **Replace the spinning video**: drop 100 JPGs named `f_001.jpg` …
  `f_100.jpg` (1280x720) into `public/scrub/`
- **Hero image**: `public/burger/burger_full.webp`
