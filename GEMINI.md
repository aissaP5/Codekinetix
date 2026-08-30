# Gemini CLI Workspace Instructions — Landing Pages Portfolio

Welcome to the **Landing Pages Portfolio** workspace. This repository represents a collection of high-fidelity, highly animated editorial landing pages built around a central freelance studio portfolio site (**CodeKinetix**).

This file provides comprehensive context for AI agents and developer colleagues to maintain, extend, and compile the workspace projects.

---

## 📂 Workspace Directory Structure

The workspace consists of a central portfolio site, multiple individual landing page sub-projects, a Puppeteer-based recording tool, and static HTML templates:

```
C:\Users\USER\Desktop\programmation\landing pages\
├── GEMINI.md                            # This instructions file (Workspace Root)
├── .capture-tool/                       # Puppeteer-based screenshot and scroll recorder
│   ├── capture.mjs                      # Main scroll recorder & preloader capture script
│   └── ...
├── codekinetix-site-frontend/           # Studio Portfolio (The main shell/hub)
│   ├── src/                             # Next.js 16/19 source code
│   │   ├── app/                         # App Router, globals.css (Acid Brutalist theme)
│   │   ├── components/                  # Portfolio views & custom transition engines
│   │   └── lib/                         # State store & project slots definitions
│   ├── scripts/
│   │   └── embed-projects.mjs          # Orchestrator compiling/embedding landing pages
│   ├── package.json
│   └── ...
├── lumea/                               # Skincare Landing Page (Next.js 16/Tailwind 4/Lenis)
│   ├── src/                             # Luxurious cream/ivory design components
│   └── package.json
├── marfil-website/                      # MARFIL Dental House Landing Page (Next.js 16/Tailwind 4, Madrid — Serrano 47)
│   ├── src/                             # Editorial "clinical atlas" layout, booking form (API parked on embed)
│   └── package.json
├── pizza-man-website/                   # Pizza-Man! Comic Pizzeria Landing Page (Next.js 16/Tailwind 4/GSAP)
│   ├── src/                             # Comic-book style, /menu route, cart state
│   └── package.json
├── smashd-landing-page/                 # Burger Landing Page (Next.js 16/Tailwind 4/Scroll-video)
│   ├── src/                             # Dark theme, anatomy scroll, tilt physics
│   └── package.json
├── coffeshop/                           # Static HTML Landing Page
│   └── pausaVF.html                     # Embedded as "pausa" inside CodeKinetix
└── Restaurant/                          # Static HTML Landing Page
    └── index.html                       # Embedded as "bistro" inside CodeKinetix
```

---

## 🏛️ Core Workspace Architecture

Rather than redirecting users to external URLs, the **CodeKinetix Studio Portfolio** acts as a single-page interactive showcase. When a user clicks a project slot, an elegant curtain transition occurs, and the selected landing page is loaded full-screen inside a custom inline `<iframe>` player (**ProjectShell**).

To support this offline-first, iframe-ready environment, the workspace implements a powerful compilation and static generation pipeline.

### 🔗 Embedding Engine (`scripts/embed-projects.mjs`)
To run this compilation, use the following command in the **`codekinetix-site-frontend`** folder:
```bash
npm run embed:projects
```

#### How it works:
1. **Next.js Sub-Project Patching**: The script dynamically injects `output: "export"` and `basePath: "/projects/<id>"` into the target project's `next.config.ts`.
2. **API route parking**: Since API routes (like Lumière's chatbot route) prevent standard static HTML exports, any `src/app/api` directory is temporarily moved/parked to `.embed-parked-api` before compilation and restored afterwards.
3. **Compilation**: It runs the static build (`next build`) in each Next.js directory.
4. **Asset Path Rewriting**: Next.js basePath config prefixes dynamic routes and chunks correctly, but raw public image assets (e.g., `<img src="/images/hero.webp" />`) would normally fail inside an iframe context. The script parses the compiled `.js`, `.css`, and `.html` outputs and rewrites standard public resource URIs to absolute `/projects/<id>/...` URLs.
5. **Static Relocation**: The fully resolved, iframe-safe static static exports are placed in the `codekinetix-site-frontend/public/projects/<id>/` folders.
6. **HTML Direct Injection**: Simple single-page static templates (`coffeshop` and `Restaurant`) are copied as-is into target locations (`pausa` and `bistro`).

---

## 💻 Sub-Project Technical Profiles

### 1. CodeKinetix Studio Portfolio (`codekinetix-site-frontend`)
*   **Aesthetic Style**: Acid Brutalist. Uses square, sharp corners, hairline borders, film-grain overlay texture (5.5% opacity on void background), and marquee strips. Zero smooth background gradient or glow slop.
*   **Color Palette**: Void `#0A0A0B`, Panel `#151517`, Bone `#F2F1EA`, Acid `#C6FF00`, Flame `#FF4D00`, Ash `#9D9D94`.
*   **Key Views & Layouts**:
    *   **AboutView**: Typographic wordmark char-reveal, pinned manifesto words scrolling wipe, horizontal "How We Work" volt progressive steps rail, and giant hover-activated services rows.
    *   **WorksView**: A vertical scrolling sticky bento-style card deck. Cards tilt and scale down into a collapsed pile as you scroll past them.
    *   **CareerView**: A horizontal timeline rail pinning years `2021` to `2026` as you scroll down.
*   **State Management**: Zustand-powered `useStore` to orchestrate view navigation (`works` | `about` | `career`), active slot states, and transition timelines.
*   **Project Slots Registry**: Managed inside `src/lib/projects.ts`. Up to 5 slots are allocated with index layouts, which map directly to target iframe paths.

### 2. LUMÉA Skincare (`lumea`)
*   **Aesthetic Style**: Elegant, luxury skincare. Uses Cormorant Garamond display serif, asymmetrical editorial spaces, and Lenis smooth scrolling.
*   **Color Palette**: Cream `#FAF7F1`, Ivory `#F3EDE2`, Linen `#EDE4D5`, Blush `#E8CBC2`, Rose `#D4A79B`, Clay `#B08D7B`, Cocoa `#2D241B`.
*   **Key Features**: Staggered letter preloader, masked scroll elements, horizontal ingredients ledger, slide-out bag/cart state manager (React Context), press carousel with autoplay timer indicator dots, and customizable motion profile (`?motion=lite` via URL overrides).

### 3. MARFIL Dental House (`marfil-website/marfil-website`)
*   **Aesthetic Style**: Editorial "clinical atlas" of a private dental house in Madrid (Calle de Serrano 47). Clean grid, serif/sans mix, photography-led.
*   **Embedded as**: `marfil` (slot 02) — replaced the old Lumière dental slot.
*   **Booking form**: `POST /api/bookings` route — parked to `.embed-parked-api` during static embed (the embedded build renders the form; submission is dev-server only).

### 4. Pizza-Man! (`pizza-man-website`)
*   **Aesthetic Style**: Comic-book pizzeria — halftone bursts, thick outlines, comic-red sunburst, GSAP-driven panels.
*   **Embedded as**: `pizzaman` (slot 06). Has a secondary static `/menu` route and a client-side cart.
*   **Delivery promise**: hero messaging "hot & fresh in 20 minutes", free delivery over €25.

### 5. SMASH'D Burgers (`smashd-landing-page`)
*   **Aesthetic Style**: Bold, premium dark award-style website. Combines ember flames, heavy black, and high-energy GSAP transitions.
*   **Color Palette**: Ink, Ember, Gold, Smoke.
*   **Burger Anatomy Video scrub**: The centerpiece section consists of a 100-frame video sequence (`f_001.jpg` to `f_100.jpg` in `public/scrub/`) scrubbed with GSAP ScrollTrigger to spin the burger while drawing custom ingredient labels.

---

## 🛠️ Recording & Capture Utilities (`.capture-tool`)

A dedicated Puppeteer automation rig is integrated in `.capture-tool/` to record cinematic clips and export preloader screenshots.

*   **Setup PATH**: Dynamically injects static `ffmpeg` binaries onto your terminal system PATH to record high-resolution `.webm` videos under the hood.
*   **Recording Process**:
    *   `node .capture-tool/capture.mjs` spins up a headless Chrome instance.
    *   Loads local pages, captures early-preloader screenshots, and records the full entry animations.
    *   Simulates scroll step ticks down the page until reaching the footer.
    *   Exports standard `.webm` clips to `codekinetix-site-frontend/public/media/` for background displays.

---

## 📐 Development Conventions & Standards

When modifying, adding, or refactoring components in this workspace, follow these strict development rules:

### 1. Style & Styling Tools
*   **Framework**: All projects use **Next.js 16/19**, **React 19**, and **Tailwind CSS v4** with postcss plugins.
*   **Spacing and Hairstyle**: Adhere to the designated theme of the corresponding folder.
    *   Do **NOT** introduce any soft orbs, gradients, blur filters, or badges into the **CodeKinetix** folder—keep its **Acid Brutalist** aesthetic square, high-contrast, and textured with hairline borders.
    *   Respect the luxury editorial style of **Luméa** and **Lumière** (uses Cormorant Garamond, subtle curves, soft luxury tones, and elegant spacing).

### 2. Scroll Choreography & Smooth Scrolling
*   **GSAP & Lenis integration**: Custom scroll-linked animations should utilize the Lenis hook context or GSAP ScrollTrigger timelines.
*   **No raw listeners**: Never attach raw, non-passive scroll or mousewheel listeners to the window/document container. This breaks the smooth scroller context and causes performance jank.
*   **Reduced Motion**: Always respect user system preferences. Implement fallback simple fades or remove intense 3D tilts for users with `prefers-reduced-motion: reduce`. Use the existing `?motion=lite` logic configuration where applicable.

### 3. Component Cleanliness
*   **Centralized Constants**: Keep text content, links, menu items, and pricing charts in constant objects at the top of the component files or inside dedicated data files (such as `clinic-data.ts` or `burger.ts`). Do not hardcode strings inside deeply nested JSX tags.
*   **State Integrity**: Do not pollute the React DOM with direct mutations. Utilize the appropriate state managers (Zustand for portfolio phases/views, Context for shopping cart drawers).

---

## 🏃 Commands Directory

| Action | Target Folder | Command |
|---|---|---|
| Run Portfolio in Dev | `codekinetix-site-frontend/` | `npm run dev` (starts on port 3000) |
| Run Skincare Page Dev | `lumea/` | `npm run dev` (starts on port 3001) |
| Run Dental Page Dev | `lumiere-dental-landing/lumiere-dental-landing/` | `npm run dev` (starts on port 3000) |
| Run Burger Page Dev | `smashd-landing-page/smashd-landing/` | `npm run dev` (starts on port 3000) |
| **Embed All Projects** | `codekinetix-site-frontend/` | `npm run embed:projects` |
| Record Cinematic Media | `.capture-tool/` | `node capture.mjs` |
| Sync DB (Prisma Dev) | `codekinetix-site-frontend/` | `npm run db:push` |
