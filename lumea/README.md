# LUMÉA — Maison de Skincare

A luxury skincare landing page for the fictional brand LUMÉA, built with
Next.js 16, TypeScript, Tailwind CSS 4, GSAP (GreenSock), and Lenis smooth
scrolling.

## Design

- **Palette**: cream `#FAF7F1`, ivory `#F3EDE2`, linen `#EDE4D5`, blush
  `#E8CBC2`, rose `#D4A79B`, clay `#B08D7B`, cocoa `#2D241B`
- **Typography**: Cormorant Garamond (display serif) + Manrope (body)
- **Texture**: subtle film-grain overlay, editorial asymmetric layouts

## Features

- Preloader with letter-stagger reveal and layered curtain exit
- GSAP scroll choreography: masked-line hero reveal, scrub manifesto,
  parallax images, animated ingredient ledger, count-up statistics,
  velocity-reactive marquee
- Press quote carousel (autoplay with progress-dot clock, pause on hover)
- Journal cards with counter-parallax
- FAQ accordion with GSAP height tweens
- Shopping bag drawer with quantity steppers and toasts
- Custom inverting cursor + magnetic buttons (desktop only)
- Lenis smooth scrolling with elegant anchor navigation
- Fully responsive (mobile-first) + `prefers-reduced-motion` lite mode
  (gentle fades), overridable via `?motion=full` / `?motion=lite`

## Run locally

Requirements: Node.js 20+ (or Bun 1.x).

```bash
npm install        # or: bun install
npm run dev        # or: bun run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.tsx        # fonts + metadata
    page.tsx          # page composition + providers
    globals.css       # design tokens + utilities
  components/
    lumea/
      smooth-scroll.tsx   # Lenis + ScrollTrigger + motion preference
      preloader.tsx       # entrance choreography
      cursor.tsx          # custom cursor
      magnetic.tsx        # magnetic hover wrapper
      navbar.tsx          # header + mobile overlay menu
      hero.tsx            # masked-line hero
      marquee.tsx         # velocity-reactive band
      philosophy.tsx      # scrub manifesto + counters
      products.tsx        # collection + add-to-bag
      ritual.tsx          # 3-step ritual
      ingredients.tsx     # ingredient ledger
      editorial.tsx       # full-bleed quote
      press.tsx           # quote carousel
      journal.tsx         # article cards
      faq.tsx             # accordion
      newsletter.tsx      # The List signup
      footer.tsx          # footer with giant wordmark
      bag.tsx             # cart state (React context)
      bag-drawer.tsx      # cart drawer UI
      toast.tsx           # GSAP toast system
      reveal.tsx          # reusable scroll reveal
public/
  images/            # AI-generated brand imagery (10 images)
  mark.svg           # favicon
```

## Customise

- **Products**: edit `PRODUCTS` in `src/components/lumea/products.tsx`
- **Palette**: edit the `@theme` block in `src/app/globals.css`
- **Copy**: each section component contains its own content constants
  at the top of the file
- **Images**: replace files in `public/images/` (keep the same names,
  or update the paths in the components)

## Deploy

Deploys cleanly to Vercel, Netlify, or any Node host:

```bash
npm run build && npm run start
```
