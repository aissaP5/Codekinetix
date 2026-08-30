"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "./Marquee";
import { HERO_BURGER } from "@/lib/burger";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["S", "M", "A", "S", "H", "'", "D"];

/** Deterministic PRNG so SSR and client render identical particles. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260824);
const SEEDS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 6 + rand() * 88,
  y: 14 + rand() * 72,
  w: 7 + rand() * 9,
  depth: 0.35 + rand() * 1.5,
  dur: 2.4 + rand() * 2.4,
  delay: rand() * 2,
}));

export function Hero({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const burger = burgerRef.current;
    const scene = sceneRef.current;
    if (!root || !burger || !scene) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const seeds = gsap.utils.toArray<HTMLElement>(".seed");
      gsap.set(seeds, { scale: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* ---------- INTRO: the burger drops in and settles ---------- */
      if (!reduced) {
        tl.fromTo(
          burger,
          { y: () => -window.innerHeight * 0.7, scale: 1.18, autoAlpha: 0, rotation: -7 },
          { y: 0, scale: 1, autoAlpha: 1, rotation: 0, duration: 1.05, ease: "power3.out" },
          0.1
        )
          /* squash & settle — weight of the landing */
          .to(burger, { scaleY: 0.9, scaleX: 1.06, duration: 0.11, ease: "power2.in" }, 1.15)
          .to(burger, {
            scaleY: 1,
            scaleX: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.32)",
          }, 1.26)
          /* glow flares on impact */
          .to(".hero-glow", { opacity: 1, scale: 1.1, duration: 0.14, ease: "power1.in" }, 1.15)
          .to(".hero-glow", { opacity: 0.65, scale: 1, duration: 0.9, ease: "power2.out" }, 1.3)
          /* camera shake */
          .to(scene, { x: -6, duration: 0.05, ease: "none" }, 1.15)
          .to(scene, { x: 5, duration: 0.05, ease: "none" })
          .to(scene, { x: -2, duration: 0.05, ease: "none" })
          .to(scene, { x: 0, duration: 0.05, ease: "none" });

        /* sesame seed burst on impact */
        SEEDS.forEach((s) => {
          const dirX = (s.x - 50) / 50;
          const dirY = (s.y - 50) / 50;
          tl.fromTo(
            `.seed-${s.id}`,
            { scale: 0, x: 0, y: 0 },
            {
              scale: 1,
              x: dirX * (30 + s.depth * 50),
              y: dirY * (22 + s.depth * 34),
              duration: 0.55,
              ease: "back.out(2.2)",
            },
            1.15
          );
        });

        /* idle float */
        tl.add(() => {
          gsap.to(burger, {
            y: "+=16",
            duration: 3.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          gsap.to(burger, {
            rotation: 1.2,
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          seeds.forEach((_, i) => {
            gsap.to(`.seed-${i}`, {
              y: "+=16",
              duration: SEEDS[i].dur,
              delay: SEEDS[i].delay,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            });
          });
        });
      } else {
        gsap.set(burger, { autoAlpha: 1 });
      }

      const titleDelay = reduced ? 0.1 : 0.35;
      tl.fromTo(
        ".hero-fill .char",
        { yPercent: 118, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 1.0, stagger: 0.045, ease: "power4.out" },
        titleDelay
      )
        .fromTo(
          ".hero-stroke .char",
          { yPercent: 118 },
          { yPercent: 0, duration: 1.0, stagger: 0.045, ease: "power4.out" },
          titleDelay + 0.16
        )
        .fromTo(
          ".hero-meta",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          titleDelay + 0.55
        );

      /* ---------- SCROLL: hero content parallaxes out ---------- */
      gsap.fromTo(
        ".burger-scroll-wrap",
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: 30,
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom 35%",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".hero-title-wrap",
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: -35,
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".seed",
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom 40%",
            scrub: true,
          },
        }
      );
    }, rootRef);

    /* ---------- MOUSE PARALLAX (3D tilt) ---------- */
    const cleanups: Array<() => void> = [];
    if (!reduced && !window.matchMedia("(hover: none)").matches) {
      const rotX = gsap.quickTo(scene, "rotationX", { duration: 1.1, ease: "power3.out" });
      const rotY = gsap.quickTo(scene, "rotationY", { duration: 1.1, ease: "power3.out" });
      const fillX = gsap.quickTo(".hero-fill", "x", { duration: 1.3, ease: "power3.out" });
      const fillY = gsap.quickTo(".hero-fill", "y", { duration: 1.3, ease: "power3.out" });
      const strokeX = gsap.quickTo(".hero-stroke", "x", { duration: 1.3, ease: "power3.out" });
      const strokeY = gsap.quickTo(".hero-stroke", "y", { duration: 1.3, ease: "power3.out" });

      const seedMovers = SEEDS.map((s) => ({
        depth: s.depth,
        xTo: gsap.quickTo(root.querySelector(`.seed-${s.id}`), "x", { duration: 1.4, ease: "power3.out" }),
      }));

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        rotY(nx * 24);
        rotX(-ny * 18);
        fillX(nx * -26);
        fillY(ny * -16);
        strokeX(nx * -38);
        strokeY(ny * -22);
        seedMovers.forEach((m) => m.xTo(nx * 46 * m.depth));
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      cleanups.push(() => window.removeEventListener("mousemove", onMove));
    }

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [active]);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-svh burger-stage overflow-hidden flex flex-col"
      aria-label="SMASH'D hero"
    >
      {/* warm glow behind burger */}
      <div
        className="hero-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-65 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,92,31,0.17), rgba(255,140,40,0.06) 55%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      {/* filled title — behind the burger */}
      <div className="hero-title-wrap absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
        <h1 className="hero-fill font-display leading-[0.86] text-foreground text-[clamp(4.2rem,19vw,21rem)] flex" aria-label="SMASH'D">
          {TITLE.map((c, i) => (
            <span key={i} className="char inline-block will-change-transform">
              {c}
            </span>
          ))}
        </h1>
      </div>

      {/* the original burger — whole, unsliced, in 3D space */}
      <div className="burger-stage absolute inset-0 flex items-center justify-center z-[3] pointer-events-none">
        <div className="burger-scroll-wrap will-change-transform flex items-center justify-center">
          <div className="burger-float will-change-transform" ref={burgerRef}>
            <div ref={sceneRef} className="burger-scene will-change-transform">
              <img
                src={HERO_BURGER}
                alt="SMASH'D signature burger"
                className="w-[min(92vw,85vh)] h-auto block select-none pointer-events-none"
                draggable={false}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>

      {/* sesame seeds drifting in 3D space */}
      <div className="absolute inset-0 z-[3] pointer-events-none" aria-hidden="true">
        {SEEDS.map((s) => (
          <span
            key={s.id}
            className={`seed seed-${s.id} absolute block`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.w}px`,
              height: `${s.w * 0.58}px`,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f9edc8 0%, #d9bd8d 100%)",
              filter: "blur(0.4px)",
              opacity: 0.85,
              boxShadow: "0 0 6px rgba(249,237,200,0.35)",
            }}
          />
        ))}
      </div>

      {/* outlined title — in front of the burger (depth sandwich) */}
      <div className="hero-title-wrap absolute inset-0 flex items-center justify-center z-[4] pointer-events-none">
        <div className="hero-stroke font-display leading-[0.86] text-stroke text-[clamp(4.2rem,19vw,21rem)] flex" aria-hidden="true">
          {TITLE.map((c, i) => (
            <span key={i} className="char inline-block will-change-transform">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* corner meta */}
      <p className="hero-meta absolute left-5 md:left-10 top-[24%] font-sans text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-smoke [writing-mode:vertical-rl] rotate-180 hidden md:block">
        Flame grilled — no shortcuts
      </p>
      <p className="hero-meta absolute right-5 md:right-10 top-[24%] font-sans text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-smoke [writing-mode:vertical-rl] hidden md:block">
        100% Angus beef · smashed to order
      </p>

      <div className="hero-meta absolute left-5 md:left-10 bottom-28 md:bottom-32 max-w-[240px] z-[5]">
        <p className="font-sans text-xs md:text-sm text-foreground/70 leading-relaxed">
          The burger that breaks the rules.{" "}
          <span className="text-ember">Scroll to dismantle it</span> — layer by
          layer.
        </p>
      </div>

      {/* rotating badge */}
      <div className="hero-meta absolute right-6 md:right-12 bottom-28 md:bottom-36 w-24 h-24 md:w-32 md:h-32 z-[5] hidden sm:block" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full spin-slow">
          <defs>
            <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-smoke" style={{ fontSize: "10.5px", letterSpacing: "0.24em", fontFamily: "var(--font-grotesk)" }}>
            <textPath href="#badge-circle">
              FRESH · DAILY · SMASHED · TO · ORDER ·
            </textPath>
          </text>
        </svg>
        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-6 h-6 text-ember" fill="currentColor" aria-hidden="true">
          <path d="M13.5 0.7c2.6 3.2 2.1 5.3.3 7 2.6-1 5.2-.4 6.9 2.4-3.3.4-4.6 2-4.4 4.7-2.6-1.7-3.4-4.1-2.4-6.7-2.7 1.4-5.2 1-6.9-1.7 3.3-.4 4.9-1.7 5.4-4.3-2.3 1.1-4.4.7-6.2-1.4 2.9-1.1 4-2.7 3.7-5.3 1.6 1.9 3 2.3 4.4 1.3-.7-1.4-.7-2.8-.8-4 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5z" />
        </svg>
      </div>

      {/* scroll hint */}
      <div className="hero-meta absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-28 z-[5] flex flex-col items-center gap-3" aria-hidden="true">
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-smoke">Scroll</span>
        <span className="block w-px h-12 bg-foreground/25 overflow-hidden relative">
          <span className="scroll-line absolute inset-x-0 top-0 h-full bg-ember origin-top" />
        </span>
      </div>

      {/* bottom marquee */}
      <div className="relative z-[6] mt-auto border-t border-line bg-ink/40 backdrop-blur-sm">
        <Marquee
          items={["100% Angus Beef", "Flame Grilled", "Smashed To Order", "No Shortcuts"]}
          speed={26}
          className="py-4 md:py-5"
        />
      </div>
    </section>
  );
}
