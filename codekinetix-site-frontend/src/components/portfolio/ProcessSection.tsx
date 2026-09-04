"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PHASES = [
  {
    id: "strategy",
    num: "I",
    title: "Brand DNA & Strategy",
    duration: "Week 01",
    headline: "Uncovering your competitive edge.",
    details:
      "We dissect your target market, benchmark references, and core business objectives to define an unmistakable creative direction before writing a single line of code.",
    deliverable: "Creative Direction & Architecture Map",
  },
  {
    id: "design",
    num: "II",
    title: "Haute-Couture UI & Motion Skids",
    duration: "Week 02",
    headline: "Visual systems engineered to captivate.",
    details:
      "We craft custom typographic scales, high-contrast layouts, bespoke iconography, and animated interactive Figma prototypes to establish the exact feel of your digital flagship.",
    deliverable: "High-Fidelity Interactive Prototypes",
  },
  {
    id: "code",
    num: "III",
    title: "Creative Front-End Engineering",
    duration: "Weeks 03–04",
    headline: "Clean architecture tuned for 60 FPS.",
    details:
      "Every component is coded from raw primitives with Next.js, React, and GSAP. Zero page bloat, sub-second hydration, and seamless responsive layouts across every device screen.",
    deliverable: "Production Next.js Codebase",
  },
  {
    id: "launch",
    num: "IV",
    title: "Testing, Edge CDN & Hand-off",
    duration: "Week 05",
    headline: "Flawless launch with zero downtime.",
    details:
      "Multi-device QA, Core Web Vitals optimization, technical SEO verification, and instant deployment to global edge CDN servers with complete codebase ownership.",
    deliverable: "Live Edge Deployment & Warranty",
  },
];

export default function ProcessSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      // 1. Entrance animation
      gsap.fromTo(
        ".process-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            scroller: scrollerEl,
            start: "top 85%",
            once: true,
          },
        }
      );

      // 2. Scroll-triggered phase highlighting across the ledger's scroll travel
      const ledger = root.querySelector<HTMLElement>(".process-ledger");
      if (ledger) {
        ScrollTrigger.create({
          trigger: ledger,
          scroller: scrollerEl,
          start: "top 72%",
          end: "bottom 28%",
          onUpdate: (self) => {
            const idx = Math.min(3, Math.floor(self.progress * 4));
            setActivePhase(idx);
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="ck-process-section px-4 sm:px-8 py-24 sm:py-32 border-t border-bone/10 bg-void relative overflow-hidden"
      aria-label="Studio Methodology"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="process-reveal flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20 pb-8 border-b border-bone/10">
          <div>
            <h2 className="font-extrabold type-xwide uppercase tracking-[-0.03em] text-bone text-3xl sm:text-5xl lg:text-7xl leading-[0.92]">
              HOW AN EXPERIENCE IS FORGED.
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="font-serif italic text-lg sm:text-xl text-bone/70 leading-snug mb-3">
              &ldquo;We don&apos;t build generic websites on templates. We build bespoke digital landmarks.&rdquo;
            </p>
            <p className="font-mono text-xs text-bone/45 tracking-wider uppercase">
              5-WEEK SPRINT FROM BLANK CANVAS TO GLOBAL CDN
            </p>
          </div>
        </div>

        {/* Bespoke Interactive Phase Ledger */}
        <div className="process-reveal process-ledger border border-bone/15 bg-panel/40 divide-y divide-bone/10">
          {PHASES.map((p, idx) => {
            const isActive = activePhase === idx;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActivePhase(idx)}
                onClick={() => setActivePhase(idx)}
                className={`group cursor-pointer transition-all duration-500 p-6 sm:p-10 ${
                  isActive
                    ? "bg-panel/90 border-l-4 border-l-volt"
                    : "hover:bg-panel/60 border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Roman Numeral & Title */}
                  <div className="flex items-baseline gap-6 sm:gap-10">
                    <span
                      className={`font-serif italic text-2xl sm:text-4xl transition-colors duration-300 ${
                        isActive ? "text-volt" : "text-bone/30 group-hover:text-bone/60"
                      }`}
                    >
                      {p.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-[9px] tracking-widest uppercase text-volt bg-volt/10 px-2 py-0.5">
                          {p.duration}
                        </span>
                        <span className="font-mono text-[9px] tracking-wider text-bone/40 uppercase">
                          {p.deliverable}
                        </span>
                      </div>
                      <h3
                        className={`font-extrabold type-wide uppercase text-xl sm:text-3xl tracking-tight transition-colors duration-300 ${
                          isActive ? "text-bone" : "text-bone/70 group-hover:text-bone"
                        }`}
                      >
                        {p.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right: Dynamic Description Expansion */}
                  <div className="lg:max-w-lg lg:text-right">
                    <p
                      className={`font-serif italic text-sm sm:text-base mb-1 transition-colors duration-300 ${
                        isActive ? "text-bone/90" : "text-bone/50"
                      }`}
                    >
                      {p.headline}
                    </p>
                    <p className="text-bone/50 text-xs sm:text-sm leading-relaxed">
                      {p.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Bottom Guarantee */}
        <div className="process-reveal mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-bone/40 border-t border-bone/10 pt-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-volt" />
            DIRECT FOUNDER-LEVEL ACCESS THROUGHOUT ALL 4 PHASES
          </span>
          <span className="text-bone/60">
            FIXED TIMELINE & SCOPE GUARANTEE
          </span>
        </div>
      </div>
    </section>
  );
}
