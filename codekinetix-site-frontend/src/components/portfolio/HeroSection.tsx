"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ═══════════════════════════════════════════════════════════ */

const CIPHER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/";
const VOLT_RGB = "58,111,255";   // #3a6fff
const BONE_RGB = "242,241,234";  // #f2f1ea

const LINES: { text: string; cls: string }[] = [
  { text: "WE BUILD",         cls: "text-bone" },
  { text: "DIGITAL",          cls: "text-stroke-bone text-transparent" },
  { text: "EXPERIENCES",      cls: "text-volt drop-shadow-[0_0_24px_rgba(58,111,255,0.45)]" },
  { text: "PEOPLE REMEMBER.", cls: "text-bone/45" },
];

interface Particle {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
  phase: number;
  freq: number;
  amp: number;
  specular: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
}

interface RawHit {
  nx: number;
  ny: number;
  r: number;
  g: number;
  b: number;
  a: number;
  specular: boolean;
}

/* Cached logo sampling to prevent re-decoding across re-renders */
let cachedRawHits: RawHit[] | null = null;

/* ═══════════════════════════════════════════════════════════
   HERO SECTION COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function HeroSection() {
  const rootRef   = useRef<HTMLElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef    = useRef<HTMLAnchorElement>(null);

  /* ──────────────────────────────────────────────────────────
     1. HIGH-PERFORMANCE PARTICLE LOGO ENGINE (ZERO MOBILE LAG)
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) return;

    // Skip particle engine entirely on mobile — canvas is hidden by CSS
    // and running it wastes CPU, memory, and battery on phones
    const isMobileViewport = () => window.innerWidth < 640;
    if (isMobileViewport()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;

    const checkMobile = () =>
      window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;

    let isMobile = checkMobile();
    // Cap DPR to 1.5 on mobile to avoid fill-rate bottleneck; 2 on desktop
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      radius: isMobile ? 95 : 135,
    };

    const ripples: Ripple[] = [];
    let particles: Particle[] = [];
    let isMounted = true;

    /* Sample logo image and extract normalized coordinates */
    const sampleLogoAsset = async (): Promise<RawHit[]> => {
      if (cachedRawHits && cachedRawHits.length > 0) {
        return cachedRawHits;
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/ck-logo.webp";

        img.onload = () => {
          const sampleW = 400;
          const sampleH = Math.max(2, Math.round((sampleW * img.naturalHeight) / img.naturalWidth));
          const off = document.createElement("canvas");
          off.width = sampleW;
          off.height = sampleH;
          const octx = off.getContext("2d", { willReadFrequently: true });
          if (!octx) {
            resolve([]);
            return;
          }

          octx.drawImage(img, 0, 0, sampleW, sampleH);
          const imgData = octx.getImageData(0, 0, sampleW, sampleH).data;

          const hits: { x: number; y: number; r: number; g: number; b: number; a: number; l: number }[] = [];
          let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;

          for (let y = 0; y < sampleH; y++) {
            for (let x = 0; x < sampleW; x++) {
              const k = (y * sampleW + x) * 4;
              const alpha = imgData[k + 3];
              if (alpha > 90) {
                const r = imgData[k];
                const g = imgData[k + 1];
                const b = imgData[k + 2];
                const l = r * 0.299 + g * 0.587 + b * 0.114;

                hits.push({ x, y, r, g, b, a: alpha / 255, l });
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          if (hits.length === 0) {
            resolve([]);
            return;
          }

          const cx = (minX + maxX) / 2;
          const cy = (minY + maxY) / 2;
          const bboxH = Math.max(1, maxY - minY);

          const result: RawHit[] = hits.map((h) => ({
            nx: (h.x - cx) / bboxH,
            ny: (h.y - cy) / bboxH,
            r: h.r,
            g: h.g,
            b: h.b,
            a: h.a,
            specular: h.l > 195,
          }));

          cachedRawHits = result;
          resolve(result);
        };

        img.onerror = () => {
          resolve([]);
        };
      });
    };

    /* Build and position particles onto current canvas */
    const buildParticles = (rawHits: RawHit[]) => {
      if (!canvas || !stage || !isMounted || rawHits.length === 0) return;

      isMobile = checkMobile();
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      pointer.radius = isMobile ? 95 : 135;

      const rect = stage.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      canvas.width  = Math.max(2, Math.round(W * dpr));
      canvas.height = Math.max(2, Math.round(H * dpr));
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adaptive particle budget: ~900 on mobile for 60fps; 2400 on desktop
      const targetCount = isMobile ? 900 : 2400;
      const step = Math.max(1, rawHits.length / targetCount);

      const sampled: RawHit[] = [];
      for (let i = 0; i < rawHits.length; i += step) {
        sampled.push(rawHits[Math.floor(i)]);
      }

      // Logo sizing: fill the stage generously, extra scale on mobile for visual impact
      const logoScale = Math.min(W * (isMobile ? 0.82 : 0.76), H * (isMobile ? 0.78 : 0.66), isMobile ? 380 : 460);
      const centerX = W / 2;
      const centerY = H / 2;

      particles = sampled.map((pt) => {
        const hx = centerX + pt.nx * logoScale;
        const hy = centerY + pt.ny * logoScale;

        // Boost blue luminance and saturation so every particle is radiant against void
        const boostR = Math.min(255, Math.round(pt.r * 1.5 + 45));
        const boostG = Math.min(255, Math.round(pt.g * 1.5 + 75));
        const boostB = Math.min(255, Math.round(pt.b * 1.2 + 95));

        return {
          x: hx + (Math.random() - 0.5) * 6,
          y: hy + (Math.random() - 0.5) * 6,
          hx,
          hy,
          vx: 0,
          vy: 0,
          r: boostR,
          g: boostG,
          b: boostB,
          a: pt.a,
          size: pt.specular ? (isMobile ? 3.2 : 2.2) : (isMobile ? 2.5 : 1.6),
          phase: Math.random() * Math.PI * 2,
          freq: 0.0014 + Math.random() * 0.0016,
          amp: isMobile ? 0.8 + Math.random() * 1.2 : 1.2 + Math.random() * 2.0,
          specular: pt.specular,
        };
      });
    };

    /* High-Performance Render Loop — Sprite-Batched for 120 FPS */
    // Pre-render particle circle sprites on offscreen canvases
    const spriteCache = new Map<string, HTMLCanvasElement>();

    const getSprite = (r: number, g: number, b: number, a: number, size: number): HTMLCanvasElement => {
      const key = `${r},${g},${b},${(a * 100) | 0},${(size * 10) | 0}`;
      let cached = spriteCache.get(key);
      if (cached) return cached;

      const s = Math.ceil(size * 2 * dpr) + 2;
      const off = document.createElement("canvas");
      off.width = s;
      off.height = s;
      const octx = off.getContext("2d")!;
      octx.beginPath();
      octx.arc(s / 2, s / 2, size * dpr, 0, Math.PI * 2);
      octx.fillStyle = `rgba(${r},${g},${b},${a * 0.95})`;
      octx.fill();
      spriteCache.set(key, off);
      return off;
    };

    // Build specular (white) sprite
    const specularSprite = (() => {
      const baseSize = isMobile ? 2.5 : 2.2;
      const s = Math.ceil(baseSize * 2 * dpr) + 2;
      const off = document.createElement("canvas");
      off.width = s;
      off.height = s;
      const octx = off.getContext("2d")!;
      octx.beginPath();
      octx.arc(s / 2, s / 2, baseSize * dpr, 0, Math.PI * 2);
      octx.fillStyle = "#ffffff";
      octx.fill();
      return off;
    })();

    const render = (time: number) => {
      if (!isMounted) return;
      // Pause rendering when tab/page is hidden to save battery & CPU
      if (document.hidden) {
        animId = 0;
        return;
      }
      ctx.clearRect(0, 0, W, H);

      // Process shockwaves / ripples
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rp = ripples[rIdx];
        rp.radius += isMobile ? 9 : 12;
        if (rp.radius > rp.maxRadius) {
          ripples.splice(rIdx, 1);
        }
      }

      const pLen = particles.length;
      const springK = isMobile ? 0.052 : 0.045;
      const dampK   = isMobile ? 0.87 : 0.885;
      const rCount  = ripples.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // 1. Spring force to home position
        const dx = p.hx - p.x;
        const dy = p.hy - p.y;
        p.vx += dx * springK;
        p.vy += dy * springK;

        // 2. Pointer repulsion
        if (pointer.active) {
          const pdx = p.x - pointer.x;
          const pdy = p.y - pointer.y;
          const dist2 = pdx * pdx + pdy * pdy;
          const r2 = pointer.radius * pointer.radius;

          if (dist2 < r2 && dist2 > 1) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / pointer.radius) * (isMobile ? 6.5 : 7.8);
            p.vx += (pdx / dist) * force;
            p.vy += (pdy / dist) * force;
          }
        }

        // 3. Shockwave impulse
        for (let rIdx = 0; rIdx < rCount; rIdx++) {
          const rp = ripples[rIdx];
          const rdx = p.x - rp.x;
          const rdy = p.y - rp.y;
          const rDist = Math.hypot(rdx, rdy);
          const diff = Math.abs(rDist - rp.radius);

          if (diff < 32 && rDist > 1) {
            const impulse = ((32 - diff) / 32) * rp.strength;
            p.vx += (rdx / rDist) * impulse;
            p.vy += (rdy / rDist) * impulse;
          }
        }

        // 4. Damping & Position Update
        p.vx *= dampK;
        p.vy *= dampK;

        p.x += p.vx;
        p.y += p.vy;

        // 5. Ambient micro-wandering (gentle breathing)
        const wanderX = Math.cos(time * p.freq + p.phase) * p.amp;
        const wanderY = Math.sin(time * p.freq * 1.3 + p.phase) * (p.amp * 0.7);

        const drawX = p.x + wanderX;
        const drawY = p.y + wanderY;

        // 6. Sprite-batched draw — single drawImage per particle (< 0.5ms total)
        const sprite = p.specular ? specularSprite : getSprite(p.r, p.g, p.b, p.a, p.size);
        const hw = sprite.width / (2 * dpr);
        const hh = sprite.height / (2 * dpr);
        ctx.drawImage(sprite, drawX - hw, drawY - hh, sprite.width / dpr, sprite.height / dpr);
      }

      animId = requestAnimationFrame(render);
    };

    /* Initialize asset & bind events */
    sampleLogoAsset().then((hits) => {
      if (!isMounted || hits.length === 0) return;
      buildParticles(hits);
      animId = requestAnimationFrame(render);
    });

    const updatePointerPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.active = true;
    };

    // Passive touch & pointer handling to keep native page scroll at 60fps
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // Touch scrolling is smooth and unhindered
      updatePointerPos(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
      ripples.push({
        x: pointer.x,
        y: pointer.y,
        radius: 4,
        maxRadius: Math.max(W, H) * (isMobile ? 0.7 : 0.55),
        strength: isMobile ? 11 : 14,
      });
    };

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cachedRawHits) {
          buildParticles(cachedRawHits);
        }
      }, 150);
    };

    stage.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage.addEventListener("pointerleave", handlePointerLeave);
    stage.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", handleResize);

    // Pause rAF loop when tab is hidden; resume when visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && !animId && isMounted && particles.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ──────────────────────────────────────────────────────────
     2. GSAP ENTRANCE & SCRAMBLE
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const root  = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* Initial states */
      gsap.set([".h-desc", ".h-act", ".h-edge"], { opacity: 0 });
      gsap.set(".h-ln", { yPercent: 110 });
      gsap.set(".h-stage-wrap", { opacity: 0, scale: 0.94 });

      /* Scramble cipher setup */
      const chars = root.querySelectorAll<HTMLElement>(".h-ch");
      chars.forEach((el) => {
        const real = el.dataset.char || "";
        if (real !== " ") {
          el.textContent = CIPHER[Math.floor(Math.random() * CIPHER.length)];
        }
      });

      /* Intro Timeline */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Stage arrives
      tl.to(".h-stage-wrap", { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" });

      // Title lines slide up
      tl.to(".h-ln", {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.07,
        ease: "power4.out",
      }, "-=0.7");

      // Description & Actions
      tl.to(".h-desc", { opacity: 1, duration: 0.65 }, "-=0.5");
      tl.to(".h-act",  { opacity: 1, duration: 0.55 }, "-=0.45");
      tl.to(".h-edge", { opacity: 1, duration: 0.6 }, "-=0.3");

      /* Character decode scramble */
      chars.forEach((el, i) => {
        const real = el.dataset.char || "";
        if (real === " ") return;
        const delayMs = 300 + i * 18;
        const totalFlips = 3 + Math.floor(Math.random() * 3);
        let count = 0;

        setTimeout(() => {
          const interval = setInterval(() => {
            if (count >= totalFlips) {
              el.textContent = real;
              clearInterval(interval);
              return;
            }
            el.textContent = CIPHER[Math.floor(Math.random() * CIPHER.length)];
            count++;
          }, 30);
        }, delayMs);
      });

      /* Idle continuous SVG rings rotation */
      gsap.to(".h-orbit-ring", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 70,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".h-orbit-ring-rev", {
        rotation: -360,
        transformOrigin: "50% 50%",
        duration: 52,
        repeat: -1,
        ease: "none",
      });

      /* Idle sweep line */
      gsap.fromTo(
        ".h-sweep",
        { x: "-100%" },
        { x: "100%", duration: 2.2, repeat: -1, ease: "sine.inOut" }
      );
    }, root);

    /* 3D Cursor Parallax on the Particle Stage (Desktop only, 0 mobile cost) */
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    let handleGlobalMouseMove: ((e: MouseEvent) => void) | null = null;

    if (!isCoarse) {
      const qx = gsap.quickTo(stage, "x", { duration: 1.2, ease: "power3.out" });
      const qy = gsap.quickTo(stage, "y", { duration: 1.2, ease: "power3.out" });
      const qrY = gsap.quickTo(stage, "rotationY", { duration: 1.2, ease: "power3.out" });
      const qrX = gsap.quickTo(stage, "rotationX", { duration: 1.2, ease: "power3.out" });

      handleGlobalMouseMove = (e: MouseEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        qx(px * 22);
        qy(py * 16);
        qrY(px * 6);
        qrX(-py * 6);
      };
      window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    }

    return () => {
      ctx.revert();
      if (handleGlobalMouseMove) {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
      }
    };
  }, []);

  /* ──────────────────────────────────────────────────────────
     3. MAGNETIC CTA BUTTON (DESKTOP)
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn || window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, { x: x * 0.2, y: y * 0.22, duration: 0.35, ease: "power3.out" });
    };

    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.75, ease: "elastic.out(1, 0.4)" });
    };

    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);

    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     RENDER (FULLY RESPONSIVE MOBILE + DESKTOP)
     ═══════════════════════════════════════════════════════════ */
  return (
    <section
      ref={rootRef}
      className="relative w-full min-h-[calc(100dvh-72px)] overflow-hidden flex flex-col justify-between bg-void isolate select-none"
      aria-label="CodeKinetix Hero"
      style={{
        background: `
          radial-gradient(circle at 74% 48%, rgba(${VOLT_RGB},0.11), transparent 42%),
          radial-gradient(circle at 18% 78%, rgba(${VOLT_RGB},0.04), transparent 36%),
          #0a0a0b
        `,
      }}
    >
      {/* ═══ TECHNICAL BACKGROUND GRID ═══ */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(${BONE_RGB},0.025) 1px, transparent 1px),
            linear-gradient(rgba(${BONE_RGB},0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ═══ NOISE TEXTURE OVERLAY ═══ */}
      <div className="noise-overlay absolute inset-0 z-40 pointer-events-none opacity-[0.035]" aria-hidden="true" />

      {/* ─────────────────────────────────────────────────────────
          MOBILE HERO (< sm) — full-bleed type layout, no canvas
          ───────────────────────────────────────────────────────── */}
      <div className="sm:hidden relative z-10 flex flex-col flex-1 px-5 pt-8 pb-6 justify-between">
        {/* Mobile top label */}
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.28em] uppercase text-bone/40 mb-8">
          <span><span className="text-volt font-bold">●</span> CODEKINETIX®</span>
          <span>EST. 2021</span>
        </div>

        {/* Mobile headline — fills width */}
        <div className="flex-1 flex flex-col justify-center">
          <h1
            className="font-extrabold type-xwide uppercase leading-[0.88] tracking-[-0.02em] text-bone mb-6"
            style={{ fontSize: "clamp(38px, 13vw, 56px)" }}
            aria-label="We build digital experiences people remember."
          >
            {LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden py-0.5">
                <span className={`h-ln block ${line.cls}`}>
                  {line.text.split("").map((ch, ci) => (
                    <span key={ci} className="h-ch inline-block" data-char={ch}>
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          {/* Volt accent divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-volt/30" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-volt uppercase">DESIGN × CODE × MOTION</span>
            <div className="h-px w-6 bg-volt/30" />
          </div>

          {/* Description */}
          <p className="h-desc font-serif italic text-[14px] leading-[1.65] text-bone/60 mb-8 max-w-[340px]">
            Bespoke digital experiences engineered from raw code — not templates.
          </p>

          {/* Stat chips row */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {[["100%", "CUSTOM CODE"], ["60fps", "ANIMATIONS"], ["24H", "RESPONSE"]].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center px-3 py-2 border border-bone/10 bg-void/60 backdrop-blur-sm">
                <span className="font-extrabold type-xwide text-volt text-sm leading-none">{val}</span>
                <span className="font-mono text-[7px] tracking-[0.2em] text-bone/40 mt-0.5">{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTAs */}
        <div className="h-act flex flex-col gap-3">
          <Link
            ref={ctaRef}
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-3 h-[50px] overflow-hidden border border-bone text-void font-mono text-[10px] font-extrabold tracking-[0.18em] uppercase bg-bone transition-all duration-300"
          >
            <span className="absolute inset-0 bg-volt translate-y-full group-hover:translate-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]" />
            <span className="relative z-[2] group-hover:text-bone transition-colors duration-300">START A PROJECT</span>
            <span className="relative z-[2] text-[14px] font-normal group-hover:text-bone group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">↗</span>
          </Link>
          <Link
            href="/works"
            className="inline-flex items-center justify-center gap-3 h-[46px] font-mono text-[10px] tracking-[0.18em] uppercase border border-bone/15 text-bone/60"
          >
            VIEW WORKS <span>↓</span>
          </Link>
        </div>

        {/* Mobile scroll cue */}
        <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[8px] tracking-[0.25em] uppercase text-bone/30">
          <span className="w-4 h-px bg-bone/20" />
          SCROLL TO EXPLORE
          <span className="w-4 h-px bg-bone/20" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          DESKTOP HERO (sm+) — split layout with particle logo
          ───────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex relative z-10 w-full max-w-[1720px] mx-auto flex-1 flex-col lg:flex-row items-center justify-between px-12 lg:px-16 pt-10 pb-10 gap-8 lg:gap-8">

        {/* ─── LEFT COLUMN: HERO COPY ─── */}
        <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col justify-center order-1 lg:order-1 text-left">

          {/* Scramble Headline */}
          <h1
            className="font-extrabold type-xwide uppercase leading-[0.92] tracking-[-0.05em]"
            style={{ fontSize: "clamp(32px, 5vw, 62px)" }}
            aria-label="We build digital experiences people remember."
          >
            {LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden pl-2 py-0.5">
                <span className={`h-ln block whitespace-nowrap ${line.cls}`}>
                  {line.text.split("").map((ch, ci) => (
                    <span key={ci} className="h-ch inline-block" data-char={ch}>
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          {/* Editorial Description */}
          <p className="h-desc max-w-[480px] mt-6 font-serif italic text-[16px] leading-[1.6] text-bone/65 pl-1">
            <strong className="text-bone font-medium not-italic">Design × Code × Motion</strong>{" "}
            engineered into bespoke digital experiences built from raw code — not templates.
          </p>

          {/* CTA Actions */}
          <div className="h-act flex flex-row items-center gap-4 mt-8 pl-1">
            {/* Primary CTA */}
            <Link
              ref={ctaRef}
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-3 h-[52px] px-7 overflow-hidden border border-bone text-void font-mono text-[10px] font-extrabold tracking-[0.18em] uppercase cursor-pointer bg-bone transition-all duration-300"
            >
              <span className="absolute inset-0 bg-volt translate-y-full group-hover:translate-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]" />
              <span className="relative z-[2] group-hover:text-bone transition-colors duration-300">
                START A PROJECT
              </span>
              <span className="relative z-[2] text-[14px] font-normal group-hover:text-bone group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                ↗
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/works"
              className="inline-flex items-center justify-center gap-3 h-[52px] px-6 font-mono text-[10px] tracking-[0.18em] uppercase border border-bone/20 text-bone/70 hover:border-volt hover:text-volt transition-all duration-300"
            >
              VIEW WORKS <span>↓</span>
            </Link>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: INTERACTIVE PARTICLE LOGO (desktop only) ─── */}
        <div className="h-stage-wrap w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center order-2 lg:order-2">
          <div
            ref={stageRef}
            className="relative w-full max-w-[480px] lg:max-w-[660px] aspect-[16/11] flex items-center justify-center cursor-crosshair group touch-pan-y mx-auto"
            style={{ perspective: "1000px" }}
          >
            {/* Ambient Radial Volt Halo */}
            <div
              className="absolute inset-[4%] rounded-full blur-[55px] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, rgba(${VOLT_RGB},0.36), rgba(${VOLT_RGB},0.10) 50%, transparent 78%)`,
              }}
              aria-hidden="true"
            />

            {/* Rotating SVG Orbital Wireframe Rings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 600 450"
              aria-hidden="true"
            >
              <ellipse
                className="h-orbit-ring"
                cx="300" cy="225" rx="235" ry="125"
                fill="none"
                stroke={`rgba(${BONE_RGB},0.06)`}
                strokeWidth="0.7"
                strokeDasharray="4 6"
              />
              <ellipse
                className="h-orbit-ring-rev"
                cx="300" cy="225" rx="205" ry="90"
                transform="rotate(-22 300 225)"
                fill="none"
                stroke={`rgba(${VOLT_RGB},0.25)`}
                strokeWidth="0.75"
              />
              <circle
                cx="300" cy="225" r="160"
                fill="none"
                stroke={`rgba(${VOLT_RGB},0.10)`}
                strokeWidth="0.6"
              />
            </svg>

            {/* ═══ THE ZERO-LAG INTERACTIVE PARTICLE CANVAS ═══ */}
            <canvas
              ref={canvasRef}
              className="relative z-10 w-full h-full block"
              aria-label="Interactive particle logo"
            />
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM EDGE BAR (DESKTOP / TABLET only)
          ═══════════════════════════════════════════════════════ */}
      <div className="h-edge relative z-10 w-full max-w-[1720px] mx-auto px-10 lg:px-16 pb-8 pt-3 border-t border-bone/10 hidden sm:flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-bone/40">
        <div>
          EST. 2021 · CODEKINETIX®
        </div>

        <div className="flex items-center gap-3">
          <span className="relative w-10 h-px overflow-hidden bg-bone/20">
            <span className="h-sweep absolute inset-0 bg-volt" style={{ transform: "translateX(-100%)" }} />
          </span>
          <span className="text-bone/60">SCROLL TO EXPLORE ↓</span>
        </div>
      </div>
    </section>
  );
}
