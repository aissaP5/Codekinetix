"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 100;
const FRAME_PATH = (i: number) => `/scrub/f_${String(i + 1).padStart(3, "0")}.jpg`;

/** Manual char split with overflow mask for line reveals. */
function SplitLine({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="char inline-block will-change-transform">
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

const LABELS = [
  { label: "BRIOCHE CROWN", sub: "Butter-brushed · sesame seeded", color: "#F2B04A" },
  { label: "BUTTER LETTUCE", sub: "Hand-torn · never shredded", color: "#9BC53D" },
  { label: "VINE TOMATO", sub: "Vine-ripened · thick cut", color: "#E5533C" },
  { label: "PICKLED ONION", sub: "Thin rings · sharp bite", color: "#D9A7E0" },
  { label: "SMASHED ANGUS", sub: "48h dry-aged · 200g", color: "#C97B4A" },
  { label: "TOASTED HEEL", sub: "Double-toasted · sauce-proof", color: "#D99A4E" },
];

const LABEL_POS = {
  // [mobileTop%, desktopTop%]
  0: [22, 16],
  1: [33, 29],
  2: [44, 41],
  3: [55, 52],
  4: [66, 63],
  5: [77, 75],
} as const;

export function AnatomySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    const canvas = canvasRef.current;
    if (!section || !pinEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ---------------- frame sequence ---------------- */
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loaded = 0;

    const drawCoverFitWidth = (img: HTMLImageElement) => {
      const w = canvas.width;
      const scale = w / img.width;
      const h = img.height * scale;
      ctx.drawImage(img, 0, (canvas.height - h) / 2, w, h);
    };

    const renderFrame = (index: number) => {
      const img = images[Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)))];
      if (img && img.complete && img.naturalWidth > 0) {
        drawCoverFitWidth(img);
      }
    };

    /* canvas sizing (DPR aware) */
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      renderFrame(current);
    };

    /* progressive preload */
    const preload = () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = FRAME_PATH(i);
        images[i] = img;
        const done = () => {
          loaded++;
          if (loaded === 1) {
            // first frame visible -> hide loader
            if (loaderRef.current) {
              loaderRef.current.style.opacity = "0";
              window.setTimeout(() => {
                if (loaderRef.current) loaderRef.current.style.display = "none";
              }, 500);
            }
            renderFrame(current);
          }
        };
        img.onload = done;
        img.onerror = done;
      }
    };

    /* ---------------- scrub state ---------------- */
    let current = 0;
    let target = 0;
    let needsRender = true;
    let visible = false;
    let raf = 0;

    const loop = () => {
      // inertia smoothing toward the scroll-driven target
      if (Math.abs(target - current) > 0.01) {
        current += (target - current) * 0.14;
        needsRender = true;
      }
      if (needsRender && visible) {
        renderFrame(current);
        needsRender = false;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    sizeCanvas();
    preload();
    window.addEventListener("resize", sizeCanvas);

    /* render only while section is on screen */
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) needsRender = true;
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    /* ---------------- GSAP scroll scrub ---------------- */
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      },
      () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: pinEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              target = self.progress * (FRAME_COUNT - 1);
            },
          },
        });

        /* title reveal */
        tl.fromTo(
          ".anatomy-title .char",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.1, stagger: 0.005, ease: "power4.out" },
          0.12
        )
          .fromTo(
            ".anatomy-sub",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.08 },
            0.2
          );

        /* labels cascade in while the burger turns */
        tl.fromTo(
          ".anatomy-label",
          { autoAlpha: 0, x: (i) => (i % 2 === 0 ? 60 : -60) },
          { autoAlpha: 1, x: 0, duration: 0.09, stagger: 0.05, ease: "power3.out" },
          0.28
        )
          .fromTo(
            ".label-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.1, stagger: 0.05, ease: "power3.out" },
            0.32
          );

        /* spin hint fades once turning starts */
        tl.to(".spin-hint", { autoAlpha: 0, y: -14, duration: 0.06 }, 0.16);

        /* labels + title exit at the end */
        tl.to(".anatomy-label", { autoAlpha: 0, duration: 0.06, stagger: 0.01 }, 0.8).to(
          ".anatomy-title .char",
          { yPercent: -115, duration: 0.07, stagger: 0.003, ease: "power2.in" },
          0.84
        ).to(".anatomy-sub", { autoAlpha: 0, duration: 0.05 }, 0.84);

        /* progress bar */
        gsap.fromTo(
          ".anatomy-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          }
        );
      }
    );

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="anatomy" className="relative h-[420vh]">
      <div
        ref={pinRef}
        className="h-svh relative overflow-hidden flex items-center justify-center bg-ink"
        aria-label="Anatomy of flavor — spin the burger by scrolling"
      >
        {/* frame-sequence canvas (the real video) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* subtle vignette to blend video edges into the page */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,7,5,0.55) 100%)",
          }}
          aria-hidden="true"
        />

        {/* frame loader */}
        <div
          ref={loaderRef}
          className="absolute inset-0 z-[4] flex items-center justify-center bg-ink transition-opacity duration-500"
          aria-hidden="true"
        >
          <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-smoke animate-pulse">
            Loading the grill…
          </span>
        </div>

        {/* title */}
        <div className="absolute top-[7vh] left-1/2 -translate-x-1/2 text-center z-[5] pointer-events-none px-4">
          <h2 className="anatomy-title font-display leading-[0.92] text-[clamp(2.6rem,7.5vw,7rem)]">
            <SplitLine text="ANATOMY OF" className="text-foreground drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]" />
            <SplitLine text="FLAVOR" className="text-ember drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]" />
          </h2>
          <p className="anatomy-sub font-sans text-[10px] md:text-xs tracking-[0.34em] uppercase text-smoke mt-3 md:mt-5">
            Six layers · zero compromises
          </p>
        </div>

        {/* spin hint */}
        <div className="spin-hint absolute bottom-[16vh] left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-foreground/80 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            Scroll to spin
          </span>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-ember" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
          </svg>
        </div>

        {/* ingredient labels */}
        {LABELS.map((layer, i) => {
          const side = i % 2 === 0 ? "right" : "left";
          const [mTop, dTop] = LABEL_POS[i as keyof typeof LABEL_POS];
          return (
            <div
              key={layer.label}
              data-side={side}
              className={`anatomy-label absolute z-[6] flex items-center gap-2 md:gap-4 ${
                side === "right"
                  ? "right-[3vw] md:right-[4vw] flex-row"
                  : "left-[3vw] md:left-[4vw] flex-row-reverse"
              } top-[var(--lt)] md:top-[var(--dt)]`}
              style={{ "--lt": `${mTop}%`, "--dt": `${dTop}%` } as React.CSSProperties}
            >
              <span
                className={`label-line block h-px w-8 md:w-[7vw] lg:w-[9vw] origin-center ${
                  side === "right"
                    ? "bg-gradient-to-r from-transparent to-current"
                    : "bg-gradient-to-l from-transparent to-current"
                }`}
                style={{ color: layer.color }}
                aria-hidden="true"
              />
              <div className="bg-ink/60 backdrop-blur-[2px] rounded md:bg-transparent md:backdrop-blur-0 md:rounded-none px-2 py-1 md:p-0 text-left">
                <span
                  className="font-display block text-[13px] md:text-2xl lg:text-[2rem] leading-none"
                  style={{ color: layer.color }}
                >
                  {layer.label}
                </span>
                <span className="block mt-1 text-[8px] md:text-[10px] lg:text-xs tracking-[0.18em] uppercase text-smoke whitespace-nowrap">
                  {layer.sub}
                </span>
              </div>
            </div>
          );
        })}

        {/* phase indicator + progress */}
        <div className="absolute bottom-[4.5vh] left-5 md:left-10 z-[6]">
          <span className="font-sans text-[9px] md:text-[11px] tracking-[0.3em] uppercase text-smoke block">
            The turn — 170° of burger
          </span>
        </div>
        <div className="absolute bottom-[4.5vh] right-5 md:right-10 z-[6] w-24 md:w-48 h-px bg-foreground/15 overflow-hidden">
          <span className="anatomy-progress block h-full w-full bg-ember origin-left scale-x-0" />
        </div>
      </div>
    </section>
  );
}
