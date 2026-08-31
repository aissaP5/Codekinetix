"use client";

import { useEffect, useRef, useState } from "react";
import { curtain } from "@/lib/curtain";

/**
 * THE WORDMARK — any text built from LIVING particles.
 *
 * Owner spec (R24): the whole CODEKINETIX wordmark is ONE horizontal
 * line of grains — the CK monogram effect promoted to the full name
 * (and the monogram itself deleted). The final glyph stays VOLT.
 *
 *   • ENTRANCE (R26/R32/R33) — every mount builds the field under a
 *     full-screen cover (the boot page on first load — the preloader
 *     joined the curtain bus in R33 — or the transition overlay on
 *     every later mount) and HOLDS its entrance clock; the ghost
 *     cloud → CK LOGO → flight → word choreography starts the frame
 *     the cover lifts. First load hands off at the boot curtain's
 *     wipe; works/career → about returns replay the same beat at the
 *     column-lift reveal. R33 compressed the clock: the logo holds
 *     ~0.95s, the flight stagger is tighter, the whole entrance
 *     lands the wordmark ~40% faster than R32 without losing a beat.
 *   • PERPETUAL LIFE — every grain orbits its home on a slow
 *     Lissajous wander and the whole word breathes with a subtle
 *     sway. It never freezes, but stays readable — "moving a little
 *     while not hovering".
 *   • LOGO → WORD FLIGHT — the entrance's second act: after the
 *     particle logo holds, every grain's home flips to its paired
 *     spot in the wordmark (paired in x-order so the swarm flows as
 *     one coherent body) and the soft springs fly it across — no
 *     bespoke tweening, just physics. The logo grains carry their
 *     own sprite mix (volt body + silver/white glints classified
 *     from the asset's own luminance ranking); the word's volt X
 *     lands last, glowing.
 *   • CURSOR DISPATCH — a wide soft-falloff repulsion field with a
 *     velocity cap: grains scatter HARD but never strobe, igniting
 *     VOLT while displaced; on leave the soft springs gather
 *     everything back into the letters.
 *   • TOUCH — drag repels along the finger; tap detonates a radial
 *     burst.
 *   • PROPORTIONAL DISPATCH (R29) — kick, velocity cap and burst
 *     force scale with the glyph cap height, clamped at the desktop
 *     reference. Absolute px tuned on 133px desktop caps made the
 *     phone's ~38px word detonate offscreen at 780px/s — "high
 *     crazy, not smooth like pc". Radii follow the pointer TYPE
 *     per event: the touch field is a finger patch, the mouse field
 *     the R24 disc — the phone now carves the same proportional
 *     hole with the same glide back.
 *   • TOUCH GLIDE (R29) — the coarse-pointer field LERPS to the
 *     finger instead of teleporting between touch samples, so the
 *     hole sweeps butter-smooth along the drag.
 *   • VOLT MIX (R33) — the word body is no longer pure bone: ~30% of
 *     its grains carry the VOLT sprite (plus the X tail and the
 *     white spark glints), so the settled wordmark reads as a live
 *     blue-flecked field — "more blue in the particles", per the
 *     owner. The grain budget also came down ~20% (spacing law
 *     widened) — faster to build, faster to settle, same texture
 *     language.
 *   • PERF (R30) — the render loop is zero-state-change: alpha is
 *     baked into a bucketed sprite atlas (3 sprites × 6 levels),
 *     the volt ignition overlay runs as one batched second pass,
 *     and displacement energy early-outs on squared distance. A
 *     QUALITY GOVERNOR watches the frame-time EMA and shifts three
 *     tiers live — grain count (uniform shuffle-prefix culling) and
 *     the volt overlay. DPR is NOT a lever (R32): a lowered backing
 *     store defocuses the wordmark — losing beads is a graceful
 *     degradation, blur never is — so weak devices still converge
 *     to a smooth 60 without ever going soft.
 *   • TRANSITION PERF (R31/R32) — the glyph raster AND the logo
 *     scan are cached at module level (tab cycles remount this
 *     component; they used to re-freeze the main thread
 *     mid-transition). A mount under a cover builds there and
 *     HOLDS its entrance clock for the reveal; while a cover
 *     hides a live field the loop runs PHYSICS-ONLY — painting
 *     resumes the frame the cover lifts.
 *   • LIBRE — the canvas is deliberately OVERSIZED (negative insets)
 *     so scattered grains fly well past the glyphs — no frame, no
 *     stage box edge.
 *   • HYGIENE — DPR clamped at 3 and NEVER lowered (a defocused
 *     backing store reads as broken — R32), rAF parked while
 *     offscreen, flat outline fallback if a 2D context can't be had.
 *
 * NOTE: no prefers-reduced-motion gate exists anywhere in this file —
 * a user-side "reduce motion" OS setting must never freeze the site.
 */

/* ── tuning ─────────────────────────────────────────────── */
const BLEED_X = 0.16; // horizontal overscan — wide word, modest bleed
const BLEED_Y = 0.68; // vertical overscan — grains fly far above/below
const SPRING = 0.0115; // pull toward (home + wander) — soft, floaty
const DAMP = 0.915; // velocity retained per frame at 60fps — long glide
const REPEL = 5.0; // cursor dispatch kick — strong scatter (desktop reference)
const VMAX = 13; // velocity cap (px/frame @60fps) — hard dispatch, zero strobe
const BURST = 22; // tap detonation kick (desktop reference)
const BURST_R = 130; // tap detonation radius floor (px, desktop reference)
const IREF = 133; // desktop reference cap height — the size the feel above was tuned at
const IMIN = 0.34; // interaction scale floor — mobile's ~38px caps get a calm proportional dispatch
const ALPHAS = [1, 0.82, 0.64, 0.46, 0.28, 0.14]; // alpha buckets — baked into sprites, zero per-grain state changes
const BAD_MS = 19; // governor: sustained frame time above this (~<52fps) = device struggling (R35: 21.5→19 for mobile)
const GOOD_MS = 17.2; // governor: sustained frame time below this (~>58fps) = headroom to climb
const FADE = 0.36; // materialize alpha ramp per grain (s) — R33: snappier birth
const LOGO_SRC = "/ck-logo.webp"; // the studio CK monogram asset
const LOGO_H = 2.2; // logo height as a multiple of the glyph cap height — the intro's centerpiece
const LOGO_HOLD = 0.95; // the particle logo holds before flying into the word (s) — R33: 1.7 → 0.95, faster start
const WORD_STAGGER = 0.42; // staggered landing window for the logo → word flight (s)
const GLYPH_H = 0.72; // cap height as a fraction of the stage font-size

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  r: number; // wander radius
  s1: number;
  s2: number; // angular speeds
  p1: number;
  p2: number; // phases
  ds: number; // draw size (css px, glow halo included)
  hds: number; // ds / 2 — prebaked half-size (2 ops/grain/frame saved)
  sp: number; // sprite: 0 bone · 1 volt · 2 spark
  delay: number; // entrance release time (s)
  nhx?: number; // pending home (the logo → word flight lands it)
  nhy?: number;
  nsp?: number;
  mrt?: number; // absolute tGlobal when the pending home lands
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* R31 — RASTER CACHE. Every tab cycle unmounts/remounts AboutView, and
   sampleHomes() used to pay the full price again each visit: raster the
   text into a ~2.6k×272 canvas, TWO getImageData reads (2.8MB each) and
   TWO ~700k-iteration JS scans — a 40-150ms main-thread freeze landing
   at t=0.8s of the section transition, exactly on the falling letters.
   The scan lives in RASTER space and is size-independent, so it caches
   per text|stretch|voltTail|font forever; each build then remaps the
   cached hits into the live canvas in one cheap pass. Robust to mobile
   URL-bar vh churn (no W/H in the key). */
const SCAN_STEP = 2; // 2px scan grid — 4× fewer iterations; grain spacing (≥2.7px) never resolves it
type RasterCache = {
  n: number;
  xs: Int16Array;
  ys: Int16Array;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  cut: number; // volt boundary (raster x) — prefix ink width
};
const rasterCache = new Map<string, RasterCache>();

/* R32 — LOGO RASTER CACHE, the twin of the text cache above. The CK
   monogram asset is constant, so its scan (a 640-wide raster, ONE
   getImageData, ONE ~400k-iteration walk, a ~150k-entry hits list)
   runs ONCE per session. Every materialize — the first load AND each
   works/career → about replay — then just picks n hits uniformly
   (partial Fisher-Yates over a persistent index scratch — no full
   150k shuffle) and classifies sprites by luminance rank. That turns
   a 20-60ms main-thread freeze landing exactly at the reveal into a
   sub-millisecond pass, so the replay can start cold without a
   hitch. */
type LogoCache = {
  n: number;
  xy: Int32Array; // packed [x, y, l] per hit (l = luminance rank key)
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};
let logoCache: LogoCache | null = null;
let logoIdx: Int32Array | null = null; // Fisher-Yates scratch over hit indices

export default function ParticleWord({
  text,
  className = "",
  stretch = "88%",
  voltTail = 1,
}: {
  text: string;
  className?: string;
  stretch?: string;
  voltTail?: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // deferred so the effect body never calls setState synchronously
      requestAnimationFrame(() => setFallback(true));
      return;
    }

    let disposed = false;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // R35 — Cap DPR at 1.5 on mobile (was 2): 44% fewer backing-store
    // pixels (3.2M → 1.8M on a 390×844 phone). The particle sprites are
    // soft radial gradients — DPR 1.5 still renders them crisply.
    const dpr = coarse
      ? Math.min(1.5, window.devicePixelRatio || 1)
      : Math.min(2.5, window.devicePixelRatio || 1);

    /* ── SIN/COS LOOKUP TABLE (R35) ────────────────────────────
       Eliminates ~4000 Math.sin/cos calls per frame for the Lissajous
       wander. 512 entries at ~0.012rad resolution is more than enough
       for slow, small-amplitude grain drifts — zero visible difference.
       The LUT is shared across all grains (phase offsets index into it
       with a fractional → integer cast). */
    const LUT_SIZE = 512;
    const LUT_MASK = LUT_SIZE - 1; // power of 2 for fast bitwise mod
    const SIN_LUT = new Float32Array(LUT_SIZE);
    const COS_LUT = new Float32Array(LUT_SIZE);
    for (let i = 0; i < LUT_SIZE; i++) {
      const a = (i / LUT_SIZE) * Math.PI * 2;
      SIN_LUT[i] = Math.sin(a);
      COS_LUT[i] = Math.cos(a);
    }
    const TAU = Math.PI * 2;
    const lutSin = (a: number) => SIN_LUT[((a / TAU * LUT_SIZE) | 0) & LUT_MASK];
    const lutCos = (a: number) => COS_LUT[((a / TAU * LUT_SIZE) | 0) & LUT_MASK];

    /* ── sprites: soft round grains, pre-rendered once ── */
    const makeSprite = (core: string, mid: string) => {
      const s = document.createElement("canvas");
      s.width = s.height = 48;
      const c = s.getContext("2d")!;
      const g = c.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, core);
      g.addColorStop(0.42, mid);
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, 48, 48);
      return s;
    };
    const sprites = [
      makeSprite("rgba(242,241,234,0.95)", "rgba(242,241,234,0.38)"), // bone
      makeSprite("rgba(120,160,255,1)", "rgba(58,111,255,0.6)"), // volt
      makeSprite("rgba(255,255,255,1)", "rgba(190,214,255,0.5)"), // spark
    ];

    /* R30 — alpha-bucketed sprite atlas: 3 sprites × 6 alpha levels
       pre-composited once (prescaled 48→32, which also improves the
       downscale). The draw loop NEVER touches ctx.globalAlpha — that
       was up to 2n state changes per frame — and settled grains all
       draw from the same bucket-0 canvas, which batches best. */
    const bSprites = sprites.map((s) =>
      ALPHAS.map((al) => {
        const b = document.createElement("canvas");
        b.width = b.height = 32;
        const c = b.getContext("2d")!;
        c.globalAlpha = al;
        c.drawImage(s, 0, 0, 32, 32);
        return b;
      }),
    );
    // inline alpha→bucket (settled grains hit bucket 0 on the first test)
    const bkt = (a: number) =>
      a >= 0.91 ? 0 : a >= 0.73 ? 1 : a >= 0.55 ? 2 : a >= 0.37 ? 3 : a >= 0.19 ? 4 : 5;

    /* ── live state ── */
    let ps: P[] = [];
    let W = 0; // canvas css size
    let H = 0;
    let glyphH = 100; // css px
    let R = 100; // fine-pointer repulsion radius (touch uses RT)
    let emin = 6; // volt ignition thresholds
    let espan = 40;
    let t = 0; // wander clock (s)
    let tGlobal = 0; // entrance clock (s)
    let last = 0;
    const ptr = { on: false, x: -9999, y: -9999 };
    // R29 — coarse-pointer field target: touch samples arrive in
    // coarse jumps; the live field LERPS to this target so the hole
    // sweeps smoothly instead of teleporting
    const ptrT = { x: -9999, y: -9999 };
    // R29 — glyph-scaled interaction values (set in build): desktop
    // clamps to the tuned feel at every size, small screens scale in
    // proportion to their letters
    let repel = REPEL;
    let vmax = VMAX;
    let burstB = BURST_R;
    let burstK = BURST;
    let RT = 48; // touch field radius — set in build (a finger patch, not a mouse dot)
    let burstBT = 56; // tap burst radius — gentler than the click blast
    let ptrCoarse = false; // live pointer type — set per event, hybrid devices dispatch right

    /* R30 — THE QUALITY GOVERNOR (R32: focus is no longer a lever).
       Three tiers, applied live without a rebuild:
         tier 2 — 100% of grains, volt overlay on
         tier 1 —  70% of grains, overlay on
         tier 0 —  50% of grains, overlay off
       The backing-store DPR used to drop with the tier — on a retina
       device tier 1 rendered the wordmark at 75% resolution and it
       read as "out of focus" (the R32 owner report). Density loss
       (fewer beads, each still pixel-sharp) degrades gracefully;
       blur never does — so DPR stays at the device's native (capped
       3) in every tier and the governor spends its budget on grain
       count + the overlay only. An EMA of raw frame time is
       evaluated twice a second; two bad windows drop a tier, four
       good windows (after a 3s cooldown) climb one back. `locked`
       (debug hook) freezes auto moves. */
    let tier = 2;
    let locked: number | null = null;
    let activeN = 0; // grains simulated + drawn (uniform: ps is shuffled)
    let overlayOn = true; // volt ignition batch pass gate
    let curDPR = dpr; // backing-store scale — native (capped 3), constant for the mount (R32)
    let emaMs = 16.7; // frame-time EMA (ms)
    let evalAcc = 0; // governor evaluation clock (s)
    let badStreak = 0;
    let goodStreak = 0;
    let lastTierT = 0; // tGlobal at the last tier change (upgrade cooldown)
    let firstBuild = true; // heuristics pick the STARTING tier only once
    let hotIdx = new Int32Array(0); // energized grain indices — reused, zero GC
    let hotBk = new Uint8Array(0); // their overlay alpha buckets
    let emin2 = 36; // emin² — skips the displacement sqrt for settled grains

    /* entrance state — the logo → word flight */
    let logoImg: HTMLImageElement | null = null;
    // R32 — HELD: the field can be BUILT while a transition cover
    // hides the hero, but the entrance clock stays parked until the
    // cover lifts — the choreography then starts AT the reveal
    // (exactly like the first load) and the reveal frame itself
    // carries zero build work. Failsafe releases after 6s so a
    // wedged cover depth can never freeze the word forever.
    let held = false;
    let heldSince = 0;

    /* ── glyph sampling — text pixel hits become homes.
       Pass 1 rasterizes the full string (bone); pass 2 rasterizes the
       prefix (text minus the volt tail) to find where the VOLT glyph
       begins, so homes right of that boundary ignite as volt grains.
       R31: the raster+scan runs ONCE per text|stretch|voltTail|font
       (module cache, STEP=2 grid) — tab-cycle remounts remap the cached
       raster hits instead of re-freezing the main thread mid-transition. ── */
    const sampleHomes = (): { hx: number; hy: number; volt: boolean }[] => {
      const fam =
        getComputedStyle(stage).fontFamily || "Archivo, sans-serif";
      const key = `${text}|${stretch}|${voltTail}|${fam}`;
      let rc = rasterCache.get(key);

      if (!rc) {
        // cache miss — rasterize + scan once, cache forever
        const off = document.createElement("canvas");
        const SF = text.length > 4 ? 170 : 300; // raster size (px)
        off.width = Math.ceil(SF * (text.length * 1.2 + 2));
        off.height = Math.ceil(SF * 1.6);
        const c = off.getContext("2d", { willReadFrequently: true })!;
        // base declaration first (always parses), then try to widen the
        // variable font — unsupported assignments are silently ignored
        const setFont = () => {
          c.font = `900 ${SF}px ${fam}`;
          c.font = `900 semi-condensed ${SF}px ${fam}`;
          (c as any).fontStretch = stretch;
        };
        c.textAlign = "center";
        c.textBaseline = "middle";
        setFont();
        c.fillStyle = "#fff";
        c.fillText(text, off.width / 2, off.height / 2);

        const img = c.getImageData(0, 0, off.width, off.height).data;
        const xs: number[] = [];
        const ys: number[] = [];
        let x0 = off.width;
        let x1 = 0;
        let y0 = off.height;
        let y1 = 0;
        for (let y = 0; y < off.height; y += SCAN_STEP) {
          for (let x = 0; x < off.width; x += SCAN_STEP) {
            if (img[(y * off.width + x) * 4 + 3] > 140) {
              xs.push(x);
              ys.push(y);
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
          }
        }
        if (!xs.length) return [];

        // pass 2 — prefix ink width → volt boundary
        let cut = x1 + 1;
        if (voltTail > 0 && voltTail < text.length) {
          c.clearRect(0, 0, off.width, off.height);
          setFont();
          c.fillStyle = "#fff";
          c.fillText(
            text.slice(0, text.length - voltTail),
            off.width / 2,
            off.height / 2
          );
          const img2 = c.getImageData(0, 0, off.width, off.height).data;
          let px1 = 0;
          for (let y = 0; y < off.height; y += SCAN_STEP) {
            for (let x = px1; x < off.width; x += SCAN_STEP) {
              if (img2[(y * off.width + x) * 4 + 3] > 140 && x > px1) px1 = x;
            }
          }
          cut = x0 + (px1 - x0) + Math.max(2, SF * 0.02);
        }

        rc = {
          n: xs.length,
          xs: Int16Array.from(xs),
          ys: Int16Array.from(ys),
          x0,
          x1,
          y0,
          y1,
          cut,
        };
        rasterCache.set(key, rc);
      }

      // remap cached raster hits into THIS canvas (cheap, size-aware)
      const bh = rc.y1 - rc.y0;
      const scale = glyphH / Math.max(1, bh);
      // ink area in css px² → grain budget. R28: the budget follows a
      // SPACING LAW, not a flat ink divisor — beads sit ~3% of the cap
      // height apart (clamped 2.7-4.6px), so the texture reads the same
      // at every size. The old flat divisor made the tiny mobile word
      // ~3× denser than desktop: grains overlapped into one compact
      // smear. Now a 36px-tall word gets properly airy, distinct beads.
      // (STEP² restores the true pixel count from the grid sample.)
      const inkCSS = rc.n * SCAN_STEP * SCAN_STEP * scale * scale;
      // R33 — spacing law widened ~13% (owner: "reduce little number of
      // particules"): beads sit ~3.4% of the cap height apart (clamped
      // 2.85-4.9px) → ~20% fewer grains on desktop, ~10% on the smallest
      // phones, same airy bead texture at every size. Faster to build,
      // faster to settle, lighter to render.
      const spacing = Math.min(4.9, Math.max(2.85, glyphH * 0.034));
      // R35 — mobile ceiling lowered 2200→1600: ~20% fewer grains on
      // phone, same airy texture (spacing law already compensates)
      const [lo, hi] = coarse ? [450, 1600] : [1300, 6000];
      const want = Math.round(
        Math.min(hi, Math.max(lo, inkCSS / (spacing * spacing)))
      );
      const keep = Math.min(1, want / rc.n);

      const homes: { hx: number; hy: number; volt: boolean }[] = [];
      const cx = (rc.x0 + rc.x1) / 2;
      const cy = (rc.y0 + rc.y1) / 2;
      for (let i = 0; i < rc.n; i++) {
        if (Math.random() > keep) continue;
        const hx = W / 2 + (rc.xs[i] - cx) * scale;
        const hy = H / 2 + (rc.ys[i] - cy) * scale;
        if (hx > 2 && hx < W - 2 && hy > 2 && hy < H - 2)
          homes.push({ hx, hy, volt: rc.xs[i] >= rc.cut });
      }
      return homes;
    };

    /* ── logo sampling — the CK monogram asset becomes grain homes.
       Sprites are classified from the asset's own luminance: the
       brightest grains read as white/silver speculars, the rest as
       the volt body — the particle logo keeps its glossy identity.
       R32: the raster scan runs ONCE per session (module cache above);
       each entrance only picks + classifies — sub-millisecond. ── */
    const sampleLogo = (n: number) => {
      if (!logoImg || !logoImg.naturalWidth || n <= 0) return null;
      let lc = logoCache;
      let idx = logoIdx;
      if (!lc || !idx) {
        const lw = 640;
        const lh = Math.max(
          2,
          Math.round((lw * logoImg.naturalHeight) / logoImg.naturalWidth)
        );
        const off = document.createElement("canvas");
        off.width = lw;
        off.height = lh;
        const c = off.getContext("2d", { willReadFrequently: true })!;
        c.drawImage(logoImg, 0, 0, lw, lh);
        const img = c.getImageData(0, 0, lw, lh).data;
        const xy: number[] = [];
        let x0 = lw;
        let x1 = 0;
        let y0 = lh;
        let y1 = 0;
        for (let y = 0; y < lh; y++) {
          for (let x = 0; x < lw; x++) {
            const k = (y * lw + x) * 4;
            if (img[k + 3] > 140) {
              xy.push(x, y, img[k] + img[k + 1] * 2 + img[k + 2] * 2);
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
          }
        }
        if (!xy.length) return null;
        lc = { n: xy.length / 3, xy: Int32Array.from(xy), x0, x1, y0, y1 };
        idx = new Int32Array(lc.n);
        for (let i = 0; i < lc.n; i++) idx[i] = i;
        logoCache = lc;
        logoIdx = idx;
      }
      const bh = lc.y1 - lc.y0 || 1;
      const scale = (glyphH * LOGO_H) / bh;
      const cx = (lc.x0 + lc.x1) / 2;
      const cy = (lc.y0 + lc.y1) / 2;
      // uniform random subset of exactly n homes — partial
      // Fisher-Yates over the persistent index scratch: O(n), never
      // a full shuffle of the ~150k cached hits
      const picked: { x: number; y: number; l: number }[] = [];
      const k = Math.min(n, lc.n);
      for (let i = 0; i < k; i++) {
        const j = i + ((Math.random() * (lc.n - i)) | 0);
        const tmp = idx[i];
        idx[i] = idx[j];
        idx[j] = tmp;
        const h = idx[i] * 3;
        picked.push({ x: lc.xy[h], y: lc.xy[h + 1], l: lc.xy[h + 2] });
      }
      while (picked.length < n) {
        const h = ((Math.random() * lc.n) | 0) * 3;
        picked.push({
          x: lc.xy[h] + Math.random() * 2 - 1,
          y: lc.xy[h + 1] + Math.random() * 2 - 1,
          l: lc.xy[h + 2],
        });
      }
      // sprite classes from the asset's own luminance ranking
      picked.sort((a, b) => b.l - a.l);
      return picked.map((h, i) => ({
        hx: W / 2 + (h.x - cx) * scale,
        hy: H / 2 + (h.y - cy) * scale,
        sp: i < picked.length * 0.06 ? 2 : i < picked.length * 0.2 ? 0 : 1,
      }));
    };

    /* R30 — apply a quality tier live. Culling works because build()
     shuffles ps — any prefix is a spatially uniform sample of the
     word. Homes live in css px so nothing rebuilds. */
    const setTier = (tt: number) => {
      tier = tt;
      lastTierT = tGlobal;
      activeN = ps.length
        ? Math.min(ps.length, Math.max(80, Math.round(ps.length * [0.5, 0.7, 1][tt])))
        : 0;
      overlayOn = tt >= 1;
      // R32 — no DPR move here, ever: the backing store stays at the
      // device's native (capped 3) resolution in every tier. See the
      // governor block above for why blur is not a quality lever.
    };

    /* ── build the field ──
       mode: "materialize" — EVERY entrance (first load and every
             works/career → about return, R32: ghost cloud condenses
             into the CK LOGO, holds, then flies into the word;
             word-only when the logo asset failed to load — the old
             "bloom" soft re-gather is gone, the owner wants the full
             choreography each time)
             "stay"        — resize rebuild (hold formation, no replay)  */
    const build = (mode: "materialize" | "stay") => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(2, Math.round(W * curDPR));
      canvas.height = Math.max(2, Math.round(H * curDPR));
      ctx.setTransform(curDPR, 0, 0, curDPR, 0, 0);

      const F = parseFloat(getComputedStyle(stage).fontSize) || 120;
      glyphH = GLYPH_H * F;
      R = Math.max(90, glyphH * 0.7); // fine pointer — the R24 field
      RT = Math.max(48, glyphH * 0.85); // touch — a finger-sized field
      emin = glyphH * 0.04;
      espan = glyphH * 0.34;
      emin2 = emin * emin;

      // R29 — interaction physics follow the glyph. Every absolute px
      // value above was tuned on desktop's ~133px caps; on a 390px
      // phone's ~38px caps the same numbers detonated the whole word
      // at 780px/s ("high crazy, not smooth like pc"). Scale by cap
      // height, clamped at 1.0 so desktop keeps the R24 feel exactly.
      const iScale = Math.min(1, Math.max(IMIN, glyphH / IREF));
      repel = REPEL * iScale;
      vmax = VMAX * iScale;
      burstK = BURST * iScale;
      burstB = Math.max(BURST_R, glyphH * 0.95); // click blast — unchanged
      burstBT = Math.max(56, glyphH * 0.95); // tap blast — smaller on small words

      const homes = sampleHomes();
      // wander scaled to the glyph — small screens drift proportionally
      // less so tiny letters stay crisp while still breathing (R28: floor
      // eased 0.5 → 0.42 to hold the wander/spacing ratio on mobile)
      const wanderK = Math.max(0.42, glyphH / 220);

      /* every entrance: the cloud condenses into the studio's CK
         LOGO, holds a beat, then flies into the word (pending homes
         below). No logo asset (fetch failed) → word-only materialize. */
      const logoState =
        mode === "materialize" ? sampleLogo(homes.length) : null;
      const asLogo = logoState !== null;

      // the word's resting formation, recorded per grain so the
      // logo → word flight can retarget each one (sprite mix included)
      const wordState: { hx: number; hy: number; sp: number }[] = [];

      ps = homes.map((h, i) => {
        const lh = logoState ? logoState[i] : null;
        const hx = lh ? lh.hx : h.hx;
        const hy = lh ? lh.hy : h.hy;
        let x: number;
        let y: number;
        let vx = 0;
        let vy = 0;
        let delay = 0;
        if (mode === "materialize") {
          // the shape is born as a FROZEN MID-EXPLOSION
          // cloud that implodes — each grain starts just beyond its
          // target, pushed outward from the center and already gliding
          // inward, so the logo (or the word, asset-less fallback)
          // condenses into focus. R33: tighter spread + faster inward
          // glide — the logo reads ~1.0s after the reveal.
          const dx = hx - W / 2;
          const dy = hy - H / 2;
          const d = Math.hypot(dx, dy) || 1;
          const nx = dx / d;
          const ny = dy / d;
          const m = glyphH * (asLogo ? rand(0.22, 0.6) : rand(0.28, 0.85));
          x = hx + nx * m + rand(-6, 6);
          y = hy + ny * m + rand(-6, 6);
          const vin = glyphH * rand(0.024, 0.04);
          vx = -nx * vin;
          vy = -ny * vin;
          delay =
            Math.max(0.06, Math.min(1, d / Math.max(1, W / 2)) * 0.15) +
            Math.random() * (asLogo ? 0.14 : 0.06);
        } else {
          // resize: hold formation
          x = hx;
          y = hy;
        }
        const u = Math.random();
        // bead size follows the glyph (≈2% of cap height) with a
        // visibility floor — R28: absolute px sizes put 2.2px beads on
        // 36px mobile caps (6% of the letter, 3.7× desktop's coverage)
        // which read as a solid blob; now every size gets the same
        // relative texture with a 1.5px see-the-bead floor
        const bead = Math.max(1.5, glyphH * 0.016);
        const beadBig = Math.max(1.9, glyphH * 0.022);
        const sz =
          u > 0.94 ? beadBig * rand(1.15, 1.5) : bead * rand(0.9, 1.25);
        // R33 — VOLT MIX: ~30% of the word body carries the volt sprite
        // (the u < 0.3 roll is independent of the size roll above), the
        // X tail stays fully volt and ~4.5% remain white spark glints —
        // the wordmark reads as a blue-flecked field instead of pure
        // bone. Owner: "add more part in blue, there only blanc".
        const wordSp = u > 0.955 ? 2 : h.volt || u < 0.3 ? 1 : 0;
        wordState.push({
          hx: h.hx,
          hy: h.hy,
          sp: wordSp,
        });
        return {
          x,
          y,
          vx,
          vy,
          hx,
          hy,
          r: rand(1.8, 3.8) * wanderK,
          s1: rand(0.2, 0.75),
          s2: rand(0.2, 0.75),
          p1: Math.random() * Math.PI * 2,
          p2: Math.random() * Math.PI * 2,
          ds: sz * 2.8,
          hds: sz * 1.4,
          sp: lh ? lh.sp : wordSp,
          delay,
        };
      });
      tGlobal = mode === "stay" ? 10 : 0; // "stay" = all released

      /* THE FLIGHT: while the entrance ran on LOGO homes, every grain
         carried its WORD home as a pending target. It lands staggered
         after LOGO_HOLD — homes flip mid-flight and the soft springs
         fly the swarm across. Homes are paired in x-order so the flow
         reads as one coherent body, the logo's flanks fanning out into
         the word's length. No tween code — physics only. */
      if (asLogo) {
        const src = ps.slice().sort((a, b) => a.hx - b.hx || a.hy - b.hy);
        const tgt = wordState.slice().sort((a, b) => a.hx - b.hx || a.hy - b.hy);
        const t0 = tGlobal + LOGO_HOLD;
        for (let i = 0; i < src.length; i++) {
          src[i].nhx = tgt[i].hx;
          src[i].nhy = tgt[i].hy;
          src[i].nsp = tgt[i].sp;
          src[i].mrt = t0 + Math.random() * WORD_STAGGER;
        }
      }

      /* R30 — shuffle so any prefix of ps is a spatially uniform
         sample (the raster-scan build order would cull the word
         top-down instead), then arm the governor: hardware hints
         pick the STARTING tier once; the runtime EMA owns it after. */
      for (let i = ps.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [ps[i], ps[j]] = [ps[j], ps[i]];
      }
      hotIdx = new Int32Array(ps.length);
      hotBk = new Uint8Array(ps.length);
      if (firstBuild) {
        firstBuild = false;
        const hc = navigator.hardwareConcurrency || 6;
        const dm = (
          navigator as Navigator & { deviceMemory?: number }
        ).deviceMemory;
        // R35 — mobile starts at tier 0 (≤4 cores) for faster first
        // paint; the governor can climb back once the EMA stabilizes
        setTier(
          hc <= 2 || dm === 2 || dm === 1
            ? 0
            : hc <= 4 || dm === 3 || dm === 4
              ? 0
              : 2,
        );
      } else {
        setTier(tier); // resize rebuild keeps the governor's tier
      }
    };

    /* ── the loop — always alive while visible ── */
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // R32 — HELD gate: the field was built under a cover and its
      // entrance clock is parked. Keep `last` fresh (a clean dt at
      // release), then release the frame the curtain lifts — the
      // choreography starts exactly at the reveal. The 6s failsafe
      // guards against a wedged cover depth. The throwaway off-screen
      // sprite keeps the atlas + backing store raster-warm so the
      // release frame never pays a cold first-batch cost (hidden under
      // the cover, ~0.1ms — the R31 paint savings are untouched).
      if (held) {
        last = now;
        if (curtain.isCovered() && now - heldSince < 6000) {
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(bSprites[0][0], -64, -64, 32, 32);
          return;
        }
        held = false;
      }
      const rawMs = Math.max(1, now - last);
      const dt = Math.min(0.05, Math.max(0.001, rawMs / 1000));
      last = now;
      const dtN = Math.min(2.2, Math.max(0.4, dt * 60));
      t += dt;
      tGlobal += dt;
      // R35 — cache pow result: dtN is the same for all grains in a
      // frame, so compute once instead of hitting the pow-guarded branch
      const damp = dtN > 0.97 && dtN < 1.03 ? DAMP : Math.pow(DAMP, dtN);

      // R31 — CURTAIN GATE: a full-screen transition cover is up.
      // (R32: entrances no longer run under a cover — the held gate
      // above parks their clock — so this now guards LIVE fields that
      // outlive a cover, e.g. a hover in progress when the user
      // clicks another tab mid-flight.) This canvas is INVISIBLE —
      // skip the clear + all sprite drawing + the volt overlay and
      // spend the frame budget on the transition's own animation
      // instead. The governor is frozen too: physics-only frames
      // would read as fake-good timings and bounce the tiers around.
      const covered = curtain.isCovered();

      // R30 — governor: EMA of raw frame time (spikes clamped to
      // 50ms so a tab switch never reads as sustained struggle)
      if (!covered) {
        emaMs += (Math.min(50, rawMs) - emaMs) * 0.06;
        if (locked === null) {
          evalAcc += dt;
          if (evalAcc >= 0.5) {
            evalAcc = 0;
            if (emaMs > BAD_MS) {
              badStreak++;
              goodStreak = 0;
            } else if (emaMs < GOOD_MS) {
              goodStreak++;
              badStreak = 0;
            } else {
              badStreak = 0;
              goodStreak = 0;
            }
            if (badStreak >= 2 && tier > 0) setTier(tier - 1);
            else if (
              goodStreak >= 4 &&
              tier < 2 &&
              tGlobal - lastTierT > 3
            )
              setTier(tier + 1);
          }
        }
      }

      // whole-word breathing — subtle, the letters never stand still
      const swayX = Math.sin(t * 0.21) * glyphH * 0.006;
      const swayY = Math.sin(t * 0.16 + 1.3) * glyphH * 0.0045;

      // R29 — touch glide: ease the live field toward the finger
      // target (fine pointers never arm ptrT and skip this)
      if (ptr.on && ptrT.x !== -9999) {
        const g = 1 - Math.pow(0.5, dtN);
        ptr.x += (ptrT.x - ptr.x) * g;
        ptr.y += (ptrT.y - ptr.y) * g;
      }

      // R29 — per-pointer field radius: the touch field is a finger
      // patch; the mouse field stays the R24 wide disc
      const Rr = ptr.on && ptrCoarse ? RT : R;
      const Rr2 = Rr * Rr;

      if (!covered) ctx.clearRect(0, 0, W, H);

      let hotN = 0; // energized grains this frame
      for (let i = 0; i < activeN; i++) {
        const p = ps[i];
        // pending home lands at its release moment (logo → word flight)
        if (p.nhx !== undefined && tGlobal >= (p.mrt ?? 0)) {
          p.hx = p.nhx;
          p.hy = p.nhy!;
          p.sp = p.nsp!;
          p.nhx = undefined;
        }
        // release gate — an unborn grain is invisible AND frozen
        const a = (tGlobal - p.delay) / FADE;
        if (a <= 0) continue;
        // R35 — trig LUT: same wander, zero Math.sin/cos calls
        const tx = p.hx + swayX + p.r * lutSin(t * p.s1 + p.p1);
        const ty = p.hy + swayY + p.r * 0.85 * lutCos(t * p.s2 + p.p2);

        p.vx += (tx - p.x) * SPRING * dtN;
        p.vy += (ty - p.y) * SPRING * dtN;

        if (ptr.on) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < Rr2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = 1 - d / Rr;
            // wide soft falloff — a big lively hole with no hard edge
            const k = Math.pow(f, 1.6) * repel * dtN;
            p.vx += (dx / d) * k;
            p.vy += (dy / d) * k;
          }
        }

        p.vx *= damp;
        p.vy *= damp;
        // cap — dispatches hard but never strobes between frames
        const v2 = p.vx * p.vx + p.vy * p.vy;
        if (v2 > vmax * vmax) {
          const s = vmax / Math.sqrt(v2);
          p.vx *= s;
          p.vy *= s;
        }
        p.x += p.vx * dtN;
        p.y += p.vy * dtN;

        // R31 — covered: physics done, painting skipped (see CURTAIN GATE)
        if (covered) continue;

        // volt ignition ∝ displacement from home — squared-distance
        // early-out: settled grains (the vast majority) never sqrt
        const ddx = p.x - p.hx;
        const ddy = p.y - p.hy;
        const d2h = ddx * ddx + ddy * ddy;
        let energy = 0;
        if (d2h > emin2) {
          const disp = Math.sqrt(d2h);
          energy = Math.min(1, (disp - emin) / espan);
        }

        const al = a >= 1 ? 1 : a;
        // R30 — bucketed sprite: no globalAlpha state change, and all
        // settled grains draw from the same bucket-0 canvas
        ctx.drawImage(
          bSprites[p.sp][bkt(al)],
          p.x - p.hds,
          p.y - p.hds,
          p.ds,
          p.ds,
        );
        if (overlayOn && energy > 0.04 && p.sp !== 1) {
          hotIdx[hotN] = i;
          hotBk[hotN] = bkt(Math.min(1, energy * al));
          hotN++;
        }
      }

      // R30 — the volt ignition overlay as ONE batched pass: zero
      // state changes, zero cost when nothing is energized or the
      // governor has overlay off
      for (let k = 0; k < hotN; k++) {
        const p = ps[hotIdx[k]];
        ctx.drawImage(
          bSprites[1][hotBk[k]],
          p.x - p.hds,
          p.y - p.hds,
          p.ds,
          p.ds,
        );
      }
    };

    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    /* ── pointer → dispatch ── */
    const setPtr = (e: PointerEvent) => {
      // R30 — offsetX/Y are already canvas-relative: no layout read
      // in the pointermove hot path (high-refresh mice fire 120+/s)
      const x = e.offsetX;
      const y = e.offsetY;
      if (e.pointerType === "touch") {
        ptrCoarse = true;
        // R29 — snap on first contact, then glide to the finger
        if (!ptr.on) {
          ptr.x = x;
          ptr.y = y;
        }
        ptrT.x = x;
        ptrT.y = y;
      } else {
        ptrCoarse = false;
        ptr.x = x;
        ptr.y = y;
        ptrT.x = -9999; // a fine pointer disarms the glide for good
        ptrT.y = -9999;
      }
      ptr.on = true;
    };
    const onEnter = (e: PointerEvent) => setPtr(e);
    const onMove = (e: PointerEvent) => setPtr(e);
    const onLeave = () => {
      ptr.on = false;
      ptr.x = -9999;
      ptr.y = -9999;
      ptrT.x = -9999;
      ptrT.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      setPtr(e);
      // tap / click detonates a radial burst — mobile parity for hover
      const bx = e.offsetX;
      const by = e.offsetY;
      // R29 — taps detonate a tighter, gentler blast than clicks
      const B = e.pointerType === "touch" ? burstBT : burstB;
      const B2 = B * B;
      for (let i = 0; i < activeN; i++) {
        const p = ps[i];
        const dx = p.x - bx;
        const dy = p.y - by;
        const d2 = dx * dx + dy * dy;
        if (d2 < B2) {
          const d = Math.sqrt(d2) + 0.001;
          const f = 1 - d / B;
          const k = f * f * burstK;
          p.vx += (dx / d) * k;
          p.vy += (dy / d) * k;
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") onLeave();
    };

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerenter", onEnter, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });
    canvas.addEventListener("pointerdown", onDown, { passive: true });
    canvas.addEventListener("pointerup", onUp, { passive: true });
    canvas.addEventListener("pointercancel", onUp, { passive: true });

    /* R30 — perf window: live governor state plus a tier pin, so
       the quality system is observable and deterministically
       testable. Inert unless called. */
    const perfHook = {
      get: () => ({
        fps: Math.round(1000 / Math.max(1, emaMs)),
        ema: Math.round(emaMs * 10) / 10,
        tier,
        activeN,
        total: ps.length,
        overlay: overlayOn,
        dpr: curDPR,
        ptr: { on: ptr.on, x: Math.round(ptr.x), y: Math.round(ptr.y) },
      }),
      lock: (t: number | null) => {
        if (t === null) {
          locked = null;
        } else if (t >= 0 && t <= 2) {
          locked = t;
          setTier(t);
        }
      },
    };
    (
      window as Window & { __kinetixPerf?: typeof perfHook }
    ).__kinetixPerf = perfHook;

    /* ── park while the hero is offscreen ── */
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) wake();
          else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    /* ── rebuild on real size changes only (mobile URL-bar churn is
         sub-threshold noise, not a rebuild) ── */
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (disposed || held) return; // a held entrance must not rebuild mid-hold
        const r = canvas.getBoundingClientRect();
        // R33 — the RO fires once with the initial size right after
        // mount; that used to trigger a phantom build("stay") BEFORE
        // boot() ran, so the word silently rendered at full tilt
        // behind the boot page and was then rebuilt at the reveal —
        // wasted work competing with the boot animation. The first
        // observation only records the baseline; boot() owns the
        // first build.
        if (lastW === 0) {
          lastW = r.width;
          lastH = r.height;
          return;
        }
        if (
          Math.abs(r.width - lastW) / Math.max(1, lastW) < 0.04 &&
          Math.abs(r.height - lastH) / Math.max(1, lastH) < 0.04
        )
          return;
        lastW = r.width;
        lastH = r.height;
        build("stay");
      }, 220);
    });
    ro.observe(stage);

    /* ── boot: wait for the real display font, then assemble.
       R33 — UNGATED FROM THE STORE: every mount runs boot()
       immediately. The first load used to idle behind the preloader
       waiting for phase → "site" and then pay the whole raster+build
       AT the curtain lift; now the preloader is on the curtain bus,
       so the field builds under the boot cover (cost hidden) and its
       held entrance clock releases the frame the cover lifts — the
       reveal frame carries zero build work and the choreography
       starts ~1s sooner. Tab cycles and project exits keep the exact
       R32 flow (mount under the transition cover → build → hold →
       release at the reveal). ── */
    const boot = async () => {
      // each await is isolated: a font-load rejection must NEVER cut
      // the logo wait short (Promise.all would reject before logoLoad
      // resolves → build() runs without the image → word-only entrance)
      const fam =
        getComputedStyle(stage).fontFamily || "Archivo, sans-serif";
      const fontLoad = (
        document as Document & { fonts?: FontFaceSet }
      ).fonts?.load?.(`900 100px ${fam}`);
      const logoLoad = new Promise<void>((res) => {
        const img = new Image();
        img.onload = () => {
          logoImg = img;
          res();
        };
        img.onerror = () => res(); // entrance falls back to the word
        img.src = LOGO_SRC;
      });
      await Promise.all([
        Promise.resolve(fontLoad).catch(() => undefined),
        logoLoad,
      ]);
      if (disposed) return;
      // R31 — if a transition cover is up (this canvas just mounted at
      // the swap moment, t≈0.8s), don't slam the build into the busiest
      // frames of the falling-letters animation. With both raster
      // caches warm (R31 text + R32 logo) the build is ~free anyway —
      // this only guards the rare cold miss.
      // R34 — the FIRST load of a session now defers 300ms (full boot
      // show, lift at 1.28s — raster lands mid-counter, harmless), but
      // a REFRESH runs the fast boot pass (lift at 0.66s): the cold
      // raster (refresh = fresh JS context = empty module caches) must
      // START ~immediately or it lands ON the lift — so the seen-boot
      // session waits only 60ms. Same sessionStorage flag as Preloader.
      let seenBoot = false;
      try {
        seenBoot = sessionStorage.getItem("ck-boot") === "1";
      } catch {
        /* private mode — never seen, full defer */
      }
      if (curtain.isCovered()) {
        await new Promise((r) => setTimeout(r, seenBoot ? 60 : 300));
        if (disposed) return;
      }
      const r = canvas.getBoundingClientRect();
      lastW = r.width;
      lastH = r.height;
      build("materialize");
      // R32/R33 — if a cover is still up (the boot page on first
      // load, works/career → about, project exit), hold the entrance
      // clock: the choreography starts the frame the cover lifts,
      // not a moment sooner.
      held = curtain.isCovered();
      heldSince = performance.now();
      wake();
    };
    boot();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      const w = window as Window & { __kinetixPerf?: typeof perfHook };
      if (w.__kinetixPerf === perfHook) delete w.__kinetixPerf;
    };
  }, [text, stretch, voltTail]);

  return (
    <div ref={stageRef} className={className} aria-hidden="true">
      {fallback ? (
        <span
          className="mark-outline absolute inset-0 font-extrabold uppercase leading-[0.82em] whitespace-nowrap"
          style={{ fontStretch: stretch }}
        >
          {text}
        </span>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute block [touch-action:pan-y]"
          style={{
            left: `${-BLEED_X * 100}%`,
            top: `${-BLEED_Y * 100}%`,
            width: `${(1 + 2 * BLEED_X) * 100}%`,
            height: `${(1 + 2 * BLEED_Y) * 100}%`,
          }}
        />
      )}
    </div>
  );
}
