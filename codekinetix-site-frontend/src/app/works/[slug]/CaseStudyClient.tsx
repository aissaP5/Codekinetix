"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { ProjectSlot } from "@/lib/projects";
import { useKinetix } from "@/lib/store";

export default function CaseStudyClient({
  slot,
  nextSlot,
}: {
  slot: ProjectSlot;
  nextSlot: ProjectSlot;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openProject = useKinetix((s) => s.openProject);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "live") {
        openProject(slot.id);
      }
    }
  }, [slot.id, openProject]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      // Entrance stagger
      gsap.fromTo(
        ".cs-fade",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      // Section scroll reveals
      gsap.utils.toArray<HTMLElement>(".cs-section").forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              scroller: scrollerEl,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [slot.id]);

  const { caseStudy } = slot;

  return (
    <div ref={rootRef} className="pb-28">
      {/* Top Breadcrumb Header */}
      <div className="px-4 sm:px-8 pt-8 pb-4 border-b border-bone/10 flex items-center justify-between font-mono text-[10px] tracking-widest text-ash uppercase">
        <Link href="/works" className="hover:text-volt transition-colors flex items-center gap-1.5">
          ← BACK TO WORKS
        </Link>
        <span className="text-volt font-bold">CASE STUDY // {slot.index}</span>
      </div>

      {/* Main Title & Hero Banner */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-16 pb-12">
        <div className="max-w-4xl mb-8">
          <div className="cs-fade flex items-center gap-3 font-mono text-xs text-volt uppercase tracking-[0.3em] mb-4">
            <span>{slot.category}</span>
            <span className="w-1 h-1 rounded-full bg-volt" />
            <span>{caseStudy.timeline}</span>
          </div>
          <h1 className="cs-fade font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-4">
            {slot.name}
          </h1>
          <p className="cs-fade font-serif italic text-2xl sm:text-3xl text-bone/80">
            {slot.tagline}
          </p>
        </div>

        {/* Project Meta Bar */}
        <div className="cs-fade grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-bone/10 font-mono text-xs mb-10">
          <div>
            <span className="text-bone/40 block text-[9px] uppercase tracking-widest mb-1">ROLE & SCOPE</span>
            <span className="text-bone">{caseStudy.role}</span>
          </div>
          <div>
            <span className="text-bone/40 block text-[9px] uppercase tracking-widest mb-1">TIMELINE</span>
            <span className="text-bone">{caseStudy.timeline}</span>
          </div>
          <div>
            <span className="text-bone/40 block text-[9px] uppercase tracking-widest mb-1">PLATFORM</span>
            <span className="text-bone">{slot.category}</span>
          </div>
          <div>
            <span className="text-bone/40 block text-[9px] uppercase tracking-widest mb-1">STATUS</span>
            <span className="text-volt font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-volt" /> LIVE IN ARCHIVE
            </span>
          </div>
        </div>

        {/* Hero Full-Bleed Media */}
        <div className="cs-fade relative aspect-[16/9] sm:aspect-[21/9] bg-void border border-bone/15 overflow-hidden group">
          <img
            src={slot.image}
            alt={slot.name}
            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-700"
          />
          {slot.video && (
            <video
              src={slot.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 sm:opacity-90 transition-opacity pointer-events-none"
            />
          )}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <button
              onClick={() => openProject(slot.id)}
              data-cursor="open"
              className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3 uppercase hover:bg-bone transition-colors shadow-2xl"
            >
              LAUNCH INTERACTIVE VIEW ↗
            </button>
          </div>
        </div>
      </section>

      {/* Case Study Details Grid */}
      <section className="px-4 sm:px-8 py-12 max-w-5xl mx-auto space-y-16">
        {/* 1. The Challenge */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              01 // CONTEXT
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              THE CHALLENGE
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-xs sm:text-sm text-bone/75 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>
        </div>

        {/* 2. The Approach */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              02 // STRATEGY
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              THE APPROACH
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-xs sm:text-sm text-bone/75 leading-relaxed">
              {caseStudy.approach}
            </p>
          </div>
        </div>

        {/* 3. The Design */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              03 // ART DIRECTION
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              THE DESIGN
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-xs sm:text-sm text-bone/75 leading-relaxed">
              {caseStudy.design}
            </p>
          </div>
        </div>

        {/* 4. The Experience */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              04 // INTERACTION & MOTION
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              THE EXPERIENCE
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-mono text-xs sm:text-sm text-bone/75 leading-relaxed">
              {caseStudy.experience}
            </p>
          </div>
        </div>

        {/* 5. Technology Stack */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              05 // ARCHITECTURE
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              THE TECHNOLOGY
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {caseStudy.technology.map((tech) => (
                <div
                  key={tech}
                  className="p-3.5 bg-panel border border-bone/10 font-mono text-xs text-bone flex items-center justify-between"
                >
                  <span>{tech}</span>
                  <span className="text-volt">✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Deliverables */}
        <div className="cs-section border-t border-bone/10 pt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase block mb-1">
              06 // DELIVERABLES
            </span>
            <h2 className="font-extrabold type-wide uppercase text-2xl text-bone">
              WHAT WAS DELIVERED
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseStudy.deliverables.map((d) => (
                <div
                  key={d}
                  className="p-3.5 bg-void border border-bone/15 font-mono text-xs text-bone/80 flex items-center gap-2"
                >
                  <span className="text-volt">✦</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Project CTA Box */}
      <section className="px-4 sm:px-8 py-12">
        <div className="border border-bone/20 bg-panel/60 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div>
            <span className="font-mono text-[9px] tracking-widest text-volt uppercase mb-2 block">
              LIVE DEMO & PREVIEW
            </span>
            <h3 className="font-extrabold type-xwide uppercase text-2xl sm:text-3xl text-bone">
              EXPERIENCE {slot.name} DIRECTLY.
            </h3>
            <p className="font-mono text-xs text-bone/60 mt-1">
              Test the full build inside our embedded viewport player.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => openProject(slot.id)}
              className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3.5 uppercase hover:bg-bone transition-colors"
            >
              LAUNCH EMBEDDED VIEW ↗
            </button>
          </div>
        </div>
      </section>

      {/* Next Project Footer Bar */}
      <section className="px-4 sm:px-8 pt-12 border-t border-bone/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="font-mono text-xs text-ash tracking-widest uppercase">
            NEXT PROJECT IN ARCHIVE //
          </span>
          <Link
            href={`/works/${nextSlot.slug}`}
            data-cursor="explore"
            className="group flex items-center gap-4 text-right"
          >
            <div>
              <p className="font-mono text-[9px] text-volt tracking-widest uppercase">
                {nextSlot.index} — {nextSlot.category}
              </p>
              <h4 className="font-extrabold type-xwide uppercase text-2xl sm:text-3xl text-bone group-hover:text-volt transition-colors">
                {nextSlot.name} ↗
              </h4>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
