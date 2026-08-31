"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";
import Marquee from "./Marquee";
import ParticleWord from "./ParticleWord";

/**
 * ABOUT — the landing view.
 *
 * 1. Hero — ONE monumental object: the full CODEKINETIX wordmark
 *    written horizontally in LIVING particles (ParticleWord). On
 *    first load, as the preloader curtain lifts, the swarm condenses
 *    into the studio's CK LOGO — the boot page's mark handed off in
 *    particles — holds a beat, then flows into the crisp wordmark
 *    (the trailing X stays volt). The cursor dispatches the grains
 *    (they ignite volt while displaced); on leave the springs
 *    re-form the word. At rest the grains keep drifting gently —
 *    the word never freezes.
 * 2. Manifesto: pinned giant words swap as you scroll — BUILD → BREAK → SHIP.
 * 3. Tools ticker: giant CSS-animated word band (velocity-boosted).
 * 4. Stats: count-up strip.
 * 5. Services: three giant rows that flood volt on hover.
 * 6. CTA: giant SAY HELLO.
 */

const WORDMARK = "CODEKINETIX";

const TOOLS = [
  "NEXT.JS",
  "TYPESCRIPT",
  "GSAP",
  "TAILWIND",
  "NODE",
  "PRISMA",
  "WEBGL",
  "SHOPIFY",
];

const SERVICES = [
  { n: "01", title: "WEBSITES", tags: "marketing · brand · seo" },
  { n: "02", title: "E-COMMERCE", tags: "storefront · checkout · cms" },
  { n: "03", title: "WEB APPS", tags: "realtime · dashboards · tools" },
];

const STATS = [
  { value: 5, suffix: "+", label: "YEARS SHIPPING" },
  { value: 48, suffix: "H", label: "TO A FIXED QUOTE" },
  { value: 30, suffix: "D", label: "SUPPORT INCLUDED" },
];

const MANIFESTO = [
  { word: "BUILD", cls: "text-bone" },
  { word: "BREAK", cls: "text-stroke-bone stroke-3" },
  { word: "SHIP", cls: "text-volt" },
];

export default function AboutView() {
  const rootRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;
    // NOTE: no prefers-reduced-motion gate — this is a motion showcase
    // site and the owner wants every system alive. (A user-side "reduce
    // motion" OS setting was silently freezing the whole site.)

    /* ── scroll-driven animation system ── */
    let unsubStore: (() => void) | undefined;
    let cancelEnterHold: (() => void) | null = null;
    const ctx = gsap.context(() => {
      /* hero entrance — GATED ON THE STORE: on first load it waits for
         the preloader curtain (phase → "site") so the reveal moment IS
         the materialize moment — the meta row + tagline fade up while
         the wordmark CONDENSES out of its ghost cloud. R32: remounts
         under a transition cover (works/career → about, project exits)
         hold for the curtain lift too, so every return plays the full
         hero beat instead of animating invisibly under the cover and
         arriving static; only uncovered remounts play instantly. */
      const enter = gsap.timeline({ paused: true });
      enter.fromTo(
        ".av-reveal",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.75, ease: "power3.out" }
      );

      const playEnter = () => enter.play();
      if (useKinetix.getState().phase === "site") {
        if (curtain.isCovered()) {
          // R32 — mounted under a cover: the hero text must rise AT the
          // reveal, in step with the held particle choreography.
          let alive = true;
          curtain.whenUncovered().then(() => {
            if (alive) playEnter();
          });
          cancelEnterHold = () => {
            alive = false;
          };
        } else {
          playEnter();
        }
      } else {
        unsubStore = useKinetix.subscribe((s, prev) => {
          if (s.phase === "site" && prev.phase !== "site") {
            unsubStore?.();
            unsubStore = undefined;
            playEnter();
          }
        });
      }

      /* hero — group exits with attitude as you scroll away */
      gsap.to(".av-hero-inner", {
        y: -110,
        rotation: -2,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".av-hero",
          scroller: scrollerEl,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* manifesto — pinned giant word swaps */
      const words = gsap.utils.toArray<HTMLElement>(".av-m-word");
      const counter = root.querySelector<HTMLElement>(".av-m-count");
      const mtl = gsap.timeline({
        scrollTrigger: {
          trigger: ".av-manifesto",
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            if (counter) {
              counter.textContent = self.progress < 0.4 ? "01" : self.progress < 0.76 ? "02" : "03";
            }
          },
        },
      });
      mtl
        .fromTo(words[0], { yPercent: 0 }, { yPercent: -120, rotation: -5, duration: 0.3, ease: "none" }, 0.06)
        .fromTo(words[1], { yPercent: 120 }, { yPercent: 0, duration: 0.26, ease: "none" }, 0.2)
        .to(words[1], { yPercent: -120, rotation: -5, duration: 0.3, ease: "none" }, 0.54)
        .fromTo(words[2], { yPercent: 120 }, { yPercent: 0, duration: 0.26, ease: "none" }, 0.68);

      /* stats — count up when they enter */
      root.querySelectorAll<HTMLElement>(".av-stat-num").forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el.closest(".av-stats"),
            scroller: scrollerEl,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(o.v)).padStart(2, "0");
          },
        });
      });
      gsap.fromTo(
        ".av-stat",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".av-stats", scroller: scrollerEl, start: "top 90%", once: true },
        }
      );

      /* services — rows slam in from the left, ghost numbers parallax */
      gsap.utils.toArray<HTMLElement>(".av-srv-row").forEach((row) => {
        gsap.fromTo(
          row,
          { x: -90, opacity: 0, rotation: -1.5 },
          {
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: row, scroller: scrollerEl, start: "top 92%", once: true },
          }
        );
      });
      gsap.utils.toArray<HTMLElement>(".av-srv-ghost").forEach((ghost) => {
        gsap.fromTo(
          ghost,
          { yPercent: 42 },
          {
            yPercent: -42,
            ease: "none",
            scrollTrigger: {
              trigger: ghost.closest(".av-srv-row") as HTMLElement,
              scroller: scrollerEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      /* CTA — chars rise through the mask */
      gsap.fromTo(
        ".av-cta-char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.035,
          ease: "power4.out",
          scrollTrigger: { trigger: ".av-cta", scroller: scrollerEl, start: "top 88%", once: true },
        }
      );
    }, root);

    return () => {
      cancelEnterHold?.();
      unsubStore?.();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="pb-32">
      {/* ──────────────────────────────────────────────── HERO
          ONE monumental object — the full CODEKINETIX wordmark as a
          horizontal line of living particles. vh-capped so short
          viewports never clip. */}
      <section className="av-hero relative flex flex-col min-h-[92vh] px-4 sm:px-8 pt-8 pb-32 sm:pb-10 overflow-hidden">
        <div className="av-hero-inner will-change-transform flex-1 flex flex-col relative z-10">
          {/* meta row */}
          <div className="av-reveal flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-bone/50 mb-4 sm:mb-8">
            <span>
              <span className="text-volt font-bold">01</span> — ABOUT
            </span>
            <span className="hidden sm:inline">DESIGN × CODE × MOTION</span>
            <span>EST. 2021</span>
          </div>

          {/* THE WORDMARK — SEO h1 carries the real text; the visual is
              the particle swarm (aria-hidden). One horizontal line,
              centered, as wide as the viewport allows. The canvas bleeds
              past its layout box so dispatched grains fly free — the
              section's overflow-hidden clips only what leaves the hero. */}
          <div className="flex-1 flex items-center justify-center">
            <h1
              className="av-hero-word select-none"
              aria-label="CodeKinetix — freelance web studio"
            >
              <span className="sr-only">
                CodeKinetix — independent freelance web studio. Websites,
                e-commerce and web applications with design, code and motion.
              </span>
              <span className="block" aria-hidden="true">
                <ParticleWord
                  text={WORDMARK}
                  className="av-word-stage relative block w-[7.1em] h-[0.82em] text-[min(13.4vw,26vh)] sm:text-[min(12.9vw,26vh)] select-none"
                />
              </span>
            </h1>
          </div>

          {/* bottom info strip — static (no float, no spin) */}
          <div className="mt-6 sm:mt-8 border-t border-bone/10 pt-5 sm:pt-6 flex items-end justify-between gap-4">
            <div className="av-reveal">
              <p className="font-serif italic text-2xl sm:text-5xl text-bone">
                web that <span className="text-volt">hits different.</span>
                <span className="not-italic inline-block text-volt text-xl sm:text-2xl align-middle ml-3" aria-hidden="true">
                  ✦
                </span>
              </p>
            </div>

            {/* scroll drip — centered */}
            <div
              className="av-reveal hidden sm:flex flex-col items-center gap-2 shrink-0"
              aria-hidden="true"
            >
              <span className="font-mono text-[9px] tracking-[0.35em] text-ash">SCROLL</span>
              <span className="relative block w-px h-8 bg-bone/15 overflow-hidden">
                <span className="absolute top-0 left-0 w-full h-4 bg-volt animate-drip" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────── MANIFESTO — pinned swap */}
      <section className="av-manifesto relative h-[220vh] sm:h-[280vh]" aria-label="Manifesto">
        <div className="sticky top-0 h-[calc(100dvh-72px)] overflow-hidden flex items-center justify-center">
          {MANIFESTO.map((m, i) => (
            <div
              key={i}
              className="av-m-wrap absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-6 px-4"
              aria-hidden={i !== 0}
            >
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.6em] text-bone/50">
                WE —
              </p>
              <h2
                className={`av-m-word font-extrabold type-xwide uppercase leading-[0.88] tracking-[-0.02em] text-[27vw] sm:text-[20vw] ${m.cls}`}
              >
                {m.word}
              </h2>
            </div>
          ))}

          {/* counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-bone/50">
            <span className="av-m-count text-volt font-bold">01</span>
            <span className="w-10 h-px bg-bone/20" aria-hidden="true" />
            <span>03</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── TOOLS TICKER — reverse drift */}
      <div className="border-y border-bone/10" aria-hidden="true">
        <Marquee variant="display" reverse items={TOOLS} />
      </div>

      {/* ──────────────────────────────────────────────── STATS */}
      <section className="av-stats border-y border-bone/10">
        <div className="grid grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`av-stat flex flex-col items-center text-center py-10 sm:py-14 px-2 ${
                i > 0 ? "border-l border-bone/10" : ""
              }`}
            >
              <p className="font-extrabold type-wide leading-none text-[13vw] sm:text-[7.5vw]">
                <span className="av-stat-num text-bone" data-value={s.value}>
                  00
                </span>
                <span className="text-volt">{s.suffix}</span>
              </p>
              <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-bone/50 mt-3 sm:mt-4">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────── SERVICES — volt flood */}
      <section className="px-4 sm:px-8 pt-16 sm:pt-24" aria-label="What we do">
        <p className="font-mono text-[10px] tracking-[0.3em] text-bone/50 mb-8 sm:mb-10 flex items-center gap-3">
          <span className="w-8 h-[3px] bg-volt" /> WHAT WE DO
        </p>

        <div className="border-b border-bone/10">
          {SERVICES.map((srv) => (
            <div
              key={srv.n}
              className="av-srv-row group relative overflow-hidden border-t border-bone/10"
            >
              {/* volt flood on hover */}
              <div
                className="absolute inset-0 bg-volt translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                aria-hidden="true"
              />
              {/* ghost index — parallaxes on scroll */}
              <span
                className="av-srv-ghost absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 font-extrabold type-xwide leading-none text-[26vw] sm:text-[15vw] text-bone/[0.05] group-hover:text-void/10 group-active:text-void/10 transition-colors duration-500 select-none pointer-events-none"
                aria-hidden="true"
              >
                {srv.n}
              </span>

              <div className="relative flex items-center gap-4 sm:gap-10 py-7 sm:py-10 px-1 sm:px-4">
                <span className="font-mono text-[11px] text-ash group-hover:text-void/60 group-active:text-void/60 transition-colors duration-400">
                  {srv.n}
                </span>
                <h3 className="font-extrabold type-xwide uppercase tracking-[-0.02em] leading-none text-[9.5vw] sm:text-[5.5vw] text-bone group-hover:text-void group-active:text-void group-hover:-translate-x-2 group-active:-translate-x-2 sm:group-hover:-translate-x-4 sm:group-active:-translate-x-4 transition-all duration-400">
                  {srv.title}
                </h3>
                <span className="ml-auto hidden md:block font-mono text-[10px] tracking-[0.2em] text-ash group-hover:text-void/60 group-active:text-void/60 transition-colors duration-400">
                  {srv.tags}
                </span>
                <span
                  className="ml-auto md:ml-0 grid place-items-center w-11 h-11 sm:w-14 sm:h-14 shrink-0 border border-bone/20 text-bone group-hover:border-void group-hover:bg-void group-hover:text-volt group-hover:rotate-45 group-active:border-void group-active:bg-void group-active:text-volt group-active:rotate-45 transition-all duration-400"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────── CTA */}
      <section className="av-cta px-4 sm:px-8 pt-20 sm:pt-28 pb-4 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-bone/50 mb-6">
          GOT A PROJECT IN MIND?
        </p>
        <a
          href="mailto:codekinetixstudio@gmail.com"
          className="group inline-block cursor-pointer focus:outline-none [-webkit-tap-highlight-color:transparent]"
          aria-label="Say hello — send us an email"
        >
          <span className="block overflow-hidden">
            <span className="flex justify-center items-baseline">
              {"SAY HELLO".split("").map((ch, i) => (
                <span
                  key={i}
                  className="av-cta-char inline-block font-extrabold type-xwide uppercase leading-[0.95] tracking-[-0.02em] text-[11.5vw] sm:text-[11vw] text-bone group-hover:text-volt transition-colors duration-300"
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
              <span className="av-cta-char inline-block font-extrabold text-[11.5vw] sm:text-[11vw] leading-[0.95] text-volt group-hover:rotate-45 transition-transform duration-300 origin-bottom-left">
                ↗
              </span>
            </span>
          </span>
        </a>
      </section>
    </div>
  );
}
