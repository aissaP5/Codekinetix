"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import LabGrid from "@/components/portfolio/LabGrid";

export default function LabPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lab-fade",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      gsap.utils.toArray<HTMLElement>(".lab-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              scroller: scrollerEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="px-4 sm:px-8 pt-10 sm:pt-16 pb-32">
      {/* Lab Header */}
      <div className="max-w-4xl mb-12 sm:mb-16">
        <div className="lab-fade flex items-center gap-3 font-mono text-[10px] text-volt uppercase tracking-[0.35em] mb-4">
          <span className="w-2 h-2 bg-volt rotate-45" />
          <span>RESEARCH & COMMERCIAL PROTOTYPES</span>
        </div>
        <h1 className="lab-fade font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
          KINETIX LAB.
        </h1>
        <p className="lab-fade font-serif italic text-xl sm:text-2xl text-bone/80 max-w-2xl leading-snug mb-4">
          Interactive components engineered to captivate audiences and drive commercial conversion.
        </p>
        <p className="lab-fade font-mono text-xs text-bone/50 max-w-xl leading-relaxed">
          Test live 60 FPS interactions below. Each module is built to be integrated directly into custom client flagships.
        </p>
      </div>

      {/* Interactive Experiments Grid */}
      <LabGrid />

      {/* Lab Callout */}
      <div className="lab-fade mt-20 p-8 sm:p-12 border border-bone/15 bg-panel/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-volt uppercase mb-2 block">
            INTEGRATION READY //
          </span>
          <h3 className="font-extrabold type-wide uppercase text-xl sm:text-2xl text-bone">
            WANT BESPOKE INTERACTIONS ON YOUR SITE?
          </h3>
          <p className="text-bone/60 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
            We architect and deploy custom 3D configurators, motion choreographies, and high-conversion UX systems tailored specifically to your brand.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-8 py-4 uppercase hover:bg-bone transition-colors shrink-0"
        >
          COMMISSION STUDIO ↗
        </Link>
      </div>
    </div>
  );
}
