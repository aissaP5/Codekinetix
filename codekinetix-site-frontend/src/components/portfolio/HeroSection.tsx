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
  { text: "PEOPLE",           cls: "text-bone/45" },
  { text: "REMEMBER.",        cls: "text-bone/45" },
];

const MOBILE_LINES: { text: string; cls: string }[] = [
  { text: "WE BUILD",         cls: "text-bone" },
  { text: "DIGITAL",          cls: "text-stroke-bone text-transparent" },
  { text: "EXPERIENCES",      cls: "text-volt drop-shadow-[0_0_24px_rgba(58,111,255,0.45)]" },
  { text: "PEOPLE",           cls: "text-bone/45" },
  { text: "REMEMBER.",        cls: "text-bone/45" },
];

interface Particle {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  amp: number;
  phase: number;
  specular: boolean;
  // Pre-computed constants for zero-lag 120 FPS math:
  dist: number;
  cosAngle: number;
  sinAngle: number;
  k1: number;
  k2: number;
  kBreathe: number;
  kSwirl: number;
  kDriftX: number;
  kDriftY: number;
  ampA: number;
  ampB: number;
  // Direct sprite reference & layout offsets (eliminates Map lookups and divisions in render)
  sprite: HTMLCanvasElement;
  hw: number;
  hh: number;
  sw: number;
  sh: number;
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
     1. HIGH-PERFORMANCE PARTICLE LOGO ENGINE (ZERO LOW-END LAG)
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) return;

    // Skip particle engine entirely on small mobile screens where canvas is hidden
    const isMobileViewport = () => window.innerWidth < 640;
    if (isMobileViewport()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isIntersecting = true;
    let W = 0;
    let H = 0;

    const checkMobile = () =>
      window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;

    const checkLowEnd = () => {
      if (typeof navigator === "undefined") return false;
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
      return cores <= 4 || memory <= 4;
    };

    let isMobile = checkMobile();
    const isLowEnd = checkLowEnd();

    // Cap DPR to 1.25 on low-end/mobile to eliminate fill-rate bottlenecks; 1.6 on desktop
    let dpr = isLowEnd ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.6);

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      radius: isMobile ? 95 : 135,
    };

    const ripples: Ripple[] = [];
    let particles: Particle[] = [];
    let isMounted = true;

    /* Sprite cache for offscreen particle textures */
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

    let specularSprite: HTMLCanvasElement;
    const buildSpecularSprite = () => {
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
      specularSprite = off;
    };
    buildSpecularSprite();

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
      dpr = isLowEnd ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.6);
      pointer.radius = isMobile ? 95 : 135;

      spriteCache.clear();
      buildSpecularSprite();

      const rect = stage.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      canvas.width  = Math.max(2, Math.round(W * dpr));
      canvas.height = Math.max(2, Math.round(H * dpr));
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adaptive particle budget: ~800 mobile, ~1400 low-end PC, ~2500 high-end desktop
      const targetCount = isMobile ? 800 : isLowEnd ? 1400 : 2500;
      const step = Math.max(1, rawHits.length / targetCount);

      const sampled: RawHit[] = [];
      for (let i = 0; i < rawHits.length; i += step) {
        sampled.push(rawHits[Math.floor(i)]);
      }

      // Logo sizing: generous presence and monumental scale
      const logoScale = Math.min(
        W * (isMobile ? 0.86 : 0.82),
        H * (isMobile ? 0.84 : 0.74),
        isMobile ? 420 : 540
      );
      const centerX = W / 2;
      const centerY = H / 2;

      particles = sampled.map((pt) => {
        const hx = centerX + pt.nx * logoScale;
        const hy = centerY + pt.ny * logoScale;

        // Boost blue luminance and saturation so every particle is radiant against void
        const boostR = Math.min(255, Math.round(pt.r * 1.5 + 45));
        const boostG = Math.min(255, Math.round(pt.g * 1.5 + 75));
        const boostB = Math.min(255, Math.round(pt.b * 1.2 + 95));

        const pSize = pt.specular ? (isMobile ? 3.4 : 2.4) : (isMobile ? 2.6 : 1.7);
        const phase = Math.random() * Math.PI * 2;
        const amp = isMobile ? 2.8 + Math.random() * 2.8 : 4.5 + Math.random() * 4.5;

        // Precompute constants to completely eliminate trigonometric and geometric math in the render loop
        const cdx = hx - centerX;
        const cdy = hy - centerY;
        const dist = Math.hypot(cdx, cdy);
        const angle = Math.atan2(cdy, cdx);
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        const sprite = pt.specular ? specularSprite : getSprite(boostR, boostG, boostB, pt.a, pSize);

        return {
          x: hx + (Math.random() - 0.5) * 8,
          y: hy + (Math.random() - 0.5) * 8,
          hx,
          hy,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          amp,
          phase,
          specular: pt.specular,
          dist,
          cosAngle,
          sinAngle,
          k1: (hx * 0.018 - hy * 0.014) + phase,
          k2: (hx * 0.014 + hy * 0.018) + phase * 0.8,
          kBreathe: -dist * 0.016 + phase * 0.5,
          kSwirl: dist * 0.01 + phase,
          kDriftX: hy * 0.015 + phase,
          kDriftY: hx * 0.015 + phase,
          ampA: amp * 0.85,
          ampB: amp * 0.72,
          sprite,
          hw: sprite.width / (2 * dpr),
          hh: sprite.height / (2 * dpr),
          sw: sprite.width / dpr,
          sh: sprite.height / dpr,
        };
      });
    };

    /* Zero-Lag Render Loop — Fully Precomputed Constants & Zero Heap Allocations */
    const render = (time: number) => {
      if (!isMounted) return;
      if (document.hidden || !isIntersecting) {
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
      const dampK   = isMobile ? 0.88 : 0.895;
      const rCount  = ripples.length;
      const tSec    = time * 0.001;
      const t22 = tSec * 2.2;
      const t18 = tSec * 1.8;
      const t16 = tSec * 1.6;
      const t12 = tSec * 1.2;
      const t15 = tSec * 1.5;
      const t13 = tSec * 1.3;

      const breatheBase = isMobile ? 2.4 : 4.0;
      const swirlBase = isMobile ? 2.0 : 3.2;
      const r2 = pointer.radius * pointer.radius;
      const pForce = isMobile ? 6.8 : 8.6;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // 1. Idle continuous forces: multi-frequency harmonic fluid waves (pure arithmetic)
        const waveA = Math.sin(t22 + p.k1) * p.ampA;
        const waveB = Math.cos(t18 + p.k2) * p.ampB;

        // Wave B: radial breathing pulse undulating outwards from center
        const breathe = Math.sin(t16 + p.kBreathe) * breatheBase;
        const breathX = p.cosAngle * breathe;
        const breathY = p.sinAngle * breathe;

        // Wave C: gentle organic vortex swirl
        const swirl = Math.sin(t12 + p.kSwirl) * swirlBase;
        const swirlX = -p.sinAngle * swirl;
        const swirlY = p.cosAngle * swirl;

        // Idle drift physics force injected into velocity for organic inertia
        p.vx += Math.sin(t15 + p.kDriftX) * 0.18;
        p.vy += Math.cos(t13 + p.kDriftY) * 0.18;

        // 2. Spring force to home position
        p.vx += (p.hx - p.x) * springK;
        p.vy += (p.hy - p.y) * springK;

        // 3. Pointer repulsion (interactive hover reaction)
        if (pointer.active) {
          const pdx = p.x - pointer.x;
          const pdy = p.y - pointer.y;
          const dist2 = pdx * pdx + pdy * pdy;

          if (dist2 < r2 && dist2 > 1) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / pointer.radius) * pForce;
            p.vx += (pdx / dist) * force;
            p.vy += (pdy / dist) * force;
          }
        }

        // 4. Shockwave impulse
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

        // 5. Damping & Position Update
        p.vx *= dampK;
        p.vy *= dampK;

        p.x += p.vx;
        p.y += p.vy;

        // 6. Sprite-batched draw: direct pointer access, zero calculations in draw call
        ctx.drawImage(
          p.sprite,
          p.x + waveA + breathX + swirlX - p.hw,
          p.y + waveB + breathY + swirlY - p.hh,
          p.sw,
          p.sh
        );
      }

      animId = requestAnimationFrame(render);
    };

    /* Initialize asset & bind events */
    sampleLogoAsset().then((hits) => {
      if (!isMounted || hits.length === 0) return;
      buildParticles(hits);
      if (isIntersecting && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
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

    // IntersectionObserver: PAUSE rAF loop completely when hero scrolls out of view
    // Immediately releases 100% of canvas CPU & GPU workload during site scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
          if (!isIntersecting) {
            if (animId) {
              cancelAnimationFrame(animId);
              animId = 0;
            }
          } else {
            if (!animId && !document.hidden && isMounted && particles.length > 0) {
              animId = requestAnimationFrame(render);
            }
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(stage);

    // Pause rAF loop when tab is hidden; resume when visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && isIntersecting && !animId && isMounted && particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else if (document.hidden && animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearTimeout(resizeTimer);
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
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
      className="relative w-full min-h-auto sm:min-h-[calc(100dvh-40px)] lg:min-h-dvh overflow-hidden flex flex-col justify-between bg-void isolate select-none border-b border-bone/10"
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
          MOBILE HERO (< sm) — cohesive editorial layout, no empty voids
          ───────────────────────────────────────────────────────── */}
      <div className="sm:hidden relative z-10 flex flex-col px-5 pt-6 pb-8">
        {/* Mobile top label */}
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-bone/40 pb-4 mb-6 border-b border-bone/10">
          <span><span className="text-volt font-bold">●</span> CODEKINETIX®</span>
          <span>DIGITAL EXPERIENCE STUDIO</span>
        </div>

        {/* Mobile headline */}
        <h1
          className="font-extrabold type-xwide uppercase leading-[0.92] tracking-[-0.03em] text-bone mb-5"
          style={{ fontSize: "clamp(30px, 9.4vw, 44px)" }}
          aria-label="We build digital experiences people remember."
        >
          {MOBILE_LINES.map((line, li) => (
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

        {/* Perfectly centered Volt accent divider with balanced equal-length wings */}
        <div className="flex items-center justify-center gap-3 my-5 w-full">
          <div className="h-px flex-1 bg-volt/30" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-volt uppercase shrink-0">
            DESIGN × CODE × MOTION
          </span>
          <div className="h-px flex-1 bg-volt/30" />
        </div>

        {/* Description */}
        <p className="h-desc font-serif italic text-[15px] leading-[1.65] text-bone/65 mb-7 max-w-[360px]">
          Bespoke digital experiences engineered from raw code — not templates.
        </p>

        {/* Mobile CTAs — tight, cohesive rhythm */}
        <div className="h-act flex flex-col gap-3">
          <Link
            ref={ctaRef}
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-3 h-[52px] overflow-hidden border border-bone text-void font-mono text-[10px] font-extrabold tracking-[0.18em] uppercase bg-bone transition-all duration-300"
          >
            <span className="absolute inset-0 bg-volt translate-y-full group-hover:translate-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]" />
            <span className="relative z-[2] group-hover:text-bone transition-colors duration-300">START A PROJECT</span>
            <span className="relative z-[2] text-[14px] font-normal group-hover:text-bone group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">↗</span>
          </Link>
          <Link
            href="/works"
            className="inline-flex items-center justify-center gap-3 h-[48px] font-mono text-[10px] tracking-[0.18em] uppercase border border-bone/15 text-bone/60"
          >
            VIEW WORKS <span>↓</span>
          </Link>
        </div>

        {/* Mobile scroll cue */}
        <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[8px] tracking-[0.25em] uppercase text-bone/30">
          <span className="w-4 h-px bg-bone/20" />
          SCROLL TO EXPLORE
          <span className="w-4 h-px bg-bone/20" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          DESKTOP HERO (sm+) — split layout with enlarged scale
          ───────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex relative z-10 w-full max-w-[1760px] mx-auto flex-1 flex-col lg:flex-row items-center justify-between px-8 md:px-12 lg:px-16 xl:px-20 pt-16 md:pt-20 lg:pt-24 pb-14 md:pb-18 lg:pb-20 gap-10 lg:gap-14">

        {/* ─── LEFT COLUMN: HERO COPY ─── */}
        <div className="w-full lg:w-[50%] xl:w-[48%] flex flex-col justify-center order-1 lg:order-1 text-left">

          {/* Scramble Headline — Enlarged monumental display */}
          <h1
            className="font-extrabold type-xwide uppercase leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: "clamp(30px, 4.4vw, 64px)" }}
            aria-label="We build digital experiences people remember."
          >
            {LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden pl-1 sm:pl-2 py-0.5">
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
          <p className="h-desc max-w-[540px] mt-8 font-serif italic text-[17px] sm:text-[18px] leading-[1.65] text-bone/65 pl-1">
            <strong className="text-bone font-medium not-italic">Design × Code × Motion</strong>{" "}
            engineered into bespoke digital experiences built from raw code — not templates.
          </p>

          {/* CTA Actions */}
          <div className="h-act flex flex-row items-center gap-4 mt-9 pl-1">
            {/* Primary CTA */}
            <Link
              ref={ctaRef}
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-3 h-[54px] px-8 overflow-hidden border border-bone text-void font-mono text-[11px] font-extrabold tracking-[0.18em] uppercase cursor-pointer bg-bone transition-all duration-300"
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
              className="inline-flex items-center justify-center gap-3 h-[54px] px-7 font-mono text-[11px] tracking-[0.18em] uppercase border border-bone/20 text-bone/70 hover:border-volt hover:text-volt transition-all duration-300"
            >
              VIEW WORKS <span>↓</span>
            </Link>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: INTERACTIVE PARTICLE LOGO (desktop only) ─── */}
        <div className="h-stage-wrap w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center order-2 lg:order-2">
          <div
            ref={stageRef}
            className="relative w-full max-w-[540px] lg:max-w-[740px] xl:max-w-[820px] aspect-[16/11] flex items-center justify-center cursor-crosshair group touch-pan-y mx-auto"
            style={{ perspective: "1000px" }}
          >
            {/* Ambient Radial Volt Halo */}
            <div
              className="absolute inset-[2%] rounded-full blur-[60px] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, rgba(${VOLT_RGB},0.38), rgba(${VOLT_RGB},0.12) 50%, transparent 78%)`,
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
          DIGITAL EXPERIENCE STUDIO · CODEKINETIX®
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
