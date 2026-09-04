"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import Marquee from "@/components/portfolio/Marquee";
import FaqSection from "@/components/portfolio/FaqSection";

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
    tag: "CRAFT",
    desc: "We engineer bespoke digital experiences from raw code. No themes, no pre-built templates, no generic shortcuts.",
    cls: "text-bone",
  },
  {
    word: "BREAK",
    tag: "INNOVATION",
    desc: "We challenge conventional design rules, push browser boundaries with creative code, and obsess over every micro-interaction.",
    cls: "text-stroke-bone stroke-3",
  },
  {
    word: "SHIP",
    tag: "IMPACT",
    desc: "We launch fast, responsive, conversion-engineered digital products that perform flawlessly in the real world.",
    cls: "text-volt",
  },
];

const STANDARDS = [
  {
    title: "Code as a Creative Craft",
    desc: "Code isn't just an implementation detail — it's the canvas. When creative direction and engineering are unified, interfaces feel alive.",
  },
  {
    title: "Agile Independent Unit",
    desc: "We are an independent boutique studio. You communicate directly with the creative developers crafting your project from day one.",
  },
  {
    title: "Kinetic Motion with Meaning",
    desc: "Every GSAP timeline, parallax shift, and cursor interaction directs visitor attention, reinforces storytelling, and elevates brand prestige.",
  },
  {
    title: "Sub-Second Performance",
    desc: "Instant loads, GPU-accelerated 60 FPS transitions, clean semantic HTML, and zero third-party dependency bloat.",
  },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      // Entrance reveal
      gsap.fromTo(
        ".about-fade",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
        }
      );

      // Manifesto animation: buttery smooth transition with responsive scrub & opacity fades
      const slides = gsap.utils.toArray<HTMLElement>(".manifesto-slide");
      const counter = root.querySelector<HTMLElement>(".m-count");

      gsap.set(slides[0], { yPercent: 0, opacity: 1 });
      gsap.set(slides[1], { yPercent: 100, opacity: 0 });
      gsap.set(slides[2], { yPercent: 100, opacity: 0 });

      const isMobile = window.innerWidth < 768;

      const mtl = gsap.timeline({
        scrollTrigger: {
          trigger: ".manifesto-wrap",
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? 0.2 : 0.45,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            if (counter) {
              counter.textContent =
                self.progress < 0.38 ? "01" : self.progress < 0.74 ? "02" : "03";
            }
          },
        },
      });

      mtl
        // BUILD exits smoothly with fade
        .to(slides[0], { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.05)
        // BREAK enters smoothly from below with fade
        .fromTo(slides[1], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.inOut" }, 0.05)
        // BREAK exits smoothly with fade
        .to(slides[1], { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.52)
        // SHIP enters smoothly from below with fade
        .fromTo(slides[2], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.inOut" }, 0.52);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="pb-8 sm:pb-12">
      {/* ──────────────────────────────────────────────── HERO & STORY */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-16">
        <div className="max-w-4xl mb-12">
          <h1 className="about-fade font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
            DESIGN × CODE × MOTION.
          </h1>
          <p className="about-fade font-serif italic text-2xl sm:text-3xl text-bone/80 leading-snug max-w-3xl">
            We are an independent digital experience studio creating bespoke websites and web applications that people remember.
          </p>
        </div>

        {/* Studio Story Grid */}
        <div className="about-fade max-w-4xl pt-8 border-t border-bone/10 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              WHO WE ARE.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-xs sm:text-sm text-bone/70 leading-relaxed">
            <p>
              CodeKinetix was created as an antidote to cookie-cutter templates, drag-and-drop page builders, and sluggish agency processes.
            </p>
            <p>
              We operate as a high-velocity creative engineering studio. We combine editorial typography scales, brutalist structural layouts, and fluid GSAP kinetic choreography with modern edge architectures.
            </p>
            <p>
              We partner directly with founders, e-commerce pioneers, dining brands, and startups worldwide to build bespoke digital spaces that elevate commercial prestige.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── MANIFESTO (BUILD / BREAK / SHIP SCROLL TILT) */}
      <div className="manifesto-wrap relative h-[240vh] sm:h-[300vh] border-t border-bone/10" aria-label="Studio Manifesto">
        <div className="sticky top-0 h-[calc(100dvh-72px)] overflow-hidden flex items-center justify-center bg-void">
          {MANIFESTO.map((m, i) => (
            <div
              key={m.word}
              className="manifesto-slide absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-6 px-4 text-center will-change-transform transform-gpu"
            >
              <span className="font-mono text-xs tracking-[0.4em] text-volt uppercase font-bold">
                {m.tag}
              </span>
              <h3
                className={`font-extrabold type-wide sm:type-xwide uppercase leading-[0.88] tracking-[-0.02em] text-[15vw] sm:text-[18vw] lg:text-[15vw] select-none max-w-full px-4 ${m.cls}`}
              >
                {m.word}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-bone/70 max-w-md leading-relaxed px-4">
                {m.desc}
              </p>
            </div>
          ))}

          {/* Sticky Counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-bone/50 bg-void/80 px-4 py-1.5 rounded-full border border-bone/10 backdrop-blur-sm">
            <span className="m-count text-volt font-bold">01</span>
            <span className="w-10 h-px bg-bone/20" aria-hidden="true" />
            <span>03</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────── TOOLS TICKER */}
      <div className="border-y border-bone/10" aria-hidden="true">
        <Marquee variant="display" reverse items={TOOLS} />
      </div>

      {/* ──────────────────────────────────── STUDIO STANDARDS */}
      <section className="px-4 sm:px-8 py-20 sm:py-28 bg-void" aria-label="Studio Standards">
        <div className="max-w-4xl mx-auto mb-14">
          <h2 className="font-extrabold type-xwide uppercase text-3xl sm:text-5xl text-bone leading-[0.95]">
            HOW WE OPERATE.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {STANDARDS.map((s) => (
            <div
              key={s.title}
              className="p-8 border border-bone/12 bg-panel/30 flex flex-col justify-between hover:border-volt/50 transition-colors duration-300"
            >
              <div>
                <span className="w-1.5 h-1.5 bg-volt rounded-full inline-block mb-4" />
                <h3 className="font-extrabold type-wide uppercase text-lg sm:text-xl text-bone mb-3">
                  {s.title}
                </h3>
                <p className="text-bone/60 text-xs sm:text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────── FAQ ACCORDION */}
      <FaqSection />
    </div>
  );
}
