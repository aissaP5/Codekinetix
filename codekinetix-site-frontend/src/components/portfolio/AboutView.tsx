"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";
import Marquee from "./Marquee";
import ParticleWord from "./ParticleWord";

const WORDMARK = "CODEKINETIX";

const TOOLS = [
  "NEXT.JS 16",
  "REACT 19",
  "TYPESCRIPT",
  "GSAP SCROLLTRIGGER",
  "TAILWIND CSS V4",
  "WEBGL & CANVAS",
  "LENIS MOMENTUM",
  "PRISMA ORM",
  "EDGE CDN",
];

const MANIFESTO = [
  {
    word: "BUILD",
    tag: "01 // CRAFT",
    desc: "We engineer digital experiences from raw code. No themes, no pre-built templates, no generic shortcuts.",
    cls: "text-bone",
  },
  {
    word: "BREAK",
    tag: "02 // INNOVATION",
    desc: "We challenge conventional design rules, push browser boundaries with creative code, and obsess over every micro-interaction.",
    cls: "text-stroke-bone stroke-3",
  },
  {
    word: "SHIP",
    tag: "03 // IMPACT",
    desc: "We launch fast, responsive, conversion-engineered digital products that perform flawlessly in the real world.",
    cls: "text-volt",
  },
];

const PRINCIPLES = [
  {
    num: "01",
    title: "CODE AS A CREATIVE CRAFT",
    desc: "We believe code isn't just an implementation tool—it's the canvas. When creative direction and engineering are unified, interfaces feel alive.",
  },
  {
    num: "02",
    title: "AGILE INDEPENDENT STUDIO",
    desc: "We are an independent boutique unit. You communicate directly with the senior creative developers crafting your project from day one.",
  },
  {
    num: "03",
    title: "KINETIC MOTION WITH MEANING",
    desc: "We don't add animations for decoration. Every GSAP timeline, parallax shift, and cursor interaction directs attention and elevates brand trust.",
  },
  {
    num: "04",
    title: "PERFORMANCE AS A STANDARD",
    desc: "Sub-second load times, GPU-accelerated 60 FPS transitions, clean semantic HTML, and zero third-party dependency bloat.",
  },
];

export default function AboutView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    let unsubStore: (() => void) | undefined;
    let cancelEnterHold: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const enter = gsap.timeline({ paused: true });
      enter.fromTo(
        ".av-reveal",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.4, ease: "power3.out" }
      );

      const playEnter = () => enter.play();
      if (useKinetix.getState().phase === "site") {
        if (curtain.isCovered()) {
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

      /* hero parallax */
      gsap.to(".av-hero-inner", {
        y: -90,
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

      /* manifesto pinned animation matching video */
      const slides = gsap.utils.toArray<HTMLElement>(".av-m-wrap");
      const counter = root.querySelector<HTMLElement>(".av-m-count");

      gsap.set(slides[0], { yPercent: 0, opacity: 1 });
      gsap.set(slides[1], { yPercent: 110, opacity: 0 });
      gsap.set(slides[2], { yPercent: 110, opacity: 0 });

      const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;

      const mtl = gsap.timeline({
        scrollTrigger: {
          trigger: ".av-manifesto",
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? 0.2 : 0.45,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            if (counter) {
              counter.textContent = self.progress < 0.38 ? "01" : self.progress < 0.74 ? "02" : "03";
            }
          },
        },
      });

      mtl
        // BUILD exits up smoothly with fade
        .to(slides[0], { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.05)
        // BREAK enters from bottom into center with fade
        .fromTo(slides[1], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.inOut" }, 0.05)
        // BREAK exits up smoothly with fade
        .to(slides[1], { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.52)
        // SHIP enters from bottom into center with fade
        .fromTo(slides[2], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.inOut" }, 0.52);
    }, root);

    return () => {
      cancelEnterHold?.();
      unsubStore?.();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="pb-28">
      {/* ──────────────────────────────────────────────── HERO */}
      <section className="av-hero relative flex flex-col min-h-[85vh] px-4 sm:px-8 pt-8 pb-14 justify-between overflow-hidden">
        <div className="av-hero-inner will-change-transform flex-1 flex flex-col relative z-10">
          <div className="av-reveal flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-bone/50 mb-6 sm:mb-10">
            <span>
              <span className="text-volt font-bold">01</span> — STUDIO DNA
            </span>
            <span className="hidden sm:inline">INDEPENDENT STUDIO // GLOBAL CLIENTELE</span>
            <span>DESIGN × CODE × MOTION</span>
          </div>

          <div className="flex-1 flex items-center justify-center my-6">
            <h1 className="av-hero-word select-none" aria-label="About CodeKinetix Studio">
              <span className="sr-only">
                About CodeKinetix — independent digital experience studio.
              </span>
              <span className="block" aria-hidden="true">
                <ParticleWord
                  text={WORDMARK}
                  className="av-word-stage relative block w-[7.1em] h-[0.82em] text-[min(13.4vw,26vh)] sm:text-[min(12.9vw,26vh)] select-none"
                />
              </span>
            </h1>
          </div>

          <div className="border-t border-bone/10 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="av-reveal max-w-2xl">
              <p className="font-serif italic text-2xl sm:text-4xl text-bone leading-tight">
                We are an independent digital experience studio creating{" "}
                <span className="text-volt not-italic font-sans font-bold">custom websites and web apps that people remember.</span>
              </p>
            </div>
            <div className="av-reveal shrink-0">
              <Link
                href="/contact"
                className="inline-block bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3.5 uppercase hover:bg-bone transition-colors"
              >
                START A PROJECT ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── STUDIO STORY */}
      <section className="px-4 sm:px-8 py-16 sm:py-24 border-t border-bone/10 bg-void">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.35em] text-volt uppercase block mb-2">
              THE STUDIO STORY //
            </span>
            <h2 className="font-extrabold type-xwide uppercase text-3xl sm:text-4xl text-bone leading-none">
              WHO WE ARE.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 font-mono text-xs sm:text-sm text-bone/70 leading-relaxed">
            <p>
              CodeKinetix was established as an antidote to the cookie-cutter templates, bloated page builders, and impersonal mega-agencies that dominate the web.
            </p>
            <p>
              We operate as a focused creative coding unit. We combine haute-couture typography, brutalist architectural layout grids, and cutting-edge GSAP kinetic motion with robust modern engineering (Next.js, TypeScript, and edge-native architectures).
            </p>
            <p>
              We partner directly with visionary founders, restaurants, healthcare leaders, e-commerce pioneers, and startups to build bespoke digital spaces that elevate credibility and convert visitors into long-term advocates.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────── MANIFESTO (BUILD / BREAK / SHIP) */}
      <section className="av-manifesto relative h-[220vh] sm:h-[280vh] border-t border-bone/10" aria-label="Studio Manifesto">
        <div className="sticky top-0 h-[calc(100dvh-72px)] overflow-hidden flex items-center justify-center">
          {MANIFESTO.map((m, i) => (
            <div
              key={i}
              className="av-m-wrap absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-6 px-4 text-center will-change-transform transform-gpu"
            >
              <span className="font-mono text-xs tracking-[0.4em] text-volt uppercase font-bold">
                {m.tag}
              </span>
              <h2
                className={`av-m-word font-extrabold type-wide sm:type-xwide uppercase leading-[0.88] tracking-[-0.02em] text-[15vw] sm:text-[18vw] lg:text-[15vw] select-none max-w-full px-4 ${m.cls}`}
              >
                {m.word}
              </h2>
              <p className="font-mono text-xs sm:text-sm text-bone/70 max-w-md leading-relaxed">
                {m.desc}
              </p>
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

      {/* ──────────────────────────────────── TOOLS TICKER */}
      <div className="border-y border-bone/10" aria-hidden="true">
        <Marquee variant="display" reverse items={TOOLS} />
      </div>

      {/* ──────────────────────────────────── STUDIO PRINCIPLES */}
      <section className="px-4 sm:px-8 py-20 sm:py-28 bg-void" aria-label="Studio Principles">
        <div className="max-w-4xl mx-auto mb-16">
          <p className="font-mono text-[10px] tracking-[0.35em] text-volt uppercase mb-3 flex items-center gap-2.5">
            <span className="w-2 h-2 bg-volt rotate-45 inline-block" />
            STUDIO PRINCIPLES //
          </p>
          <h2 className="font-extrabold type-xwide uppercase text-3xl sm:text-5xl text-bone leading-[0.95]">
            HOW WE THINK.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRINCIPLES.map((p) => (
            <div
              key={p.num}
              className="p-8 border border-bone/15 bg-panel/50 flex flex-col justify-between hover:border-volt/60 transition-colors duration-300"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-volt font-bold mb-6">
                  <span>{p.num} //</span>
                  <span>CORE RULE</span>
                </div>
                <h3 className="font-extrabold type-wide uppercase text-xl text-bone mb-3">
                  {p.title}
                </h3>
                <p className="font-mono text-xs text-bone/65 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-bone/5 flex justify-between font-mono text-[9px] text-bone/30 uppercase">
                <span>NON-NEGOTIABLE</span>
                <span>✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
