"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import HeroSection from "@/components/portfolio/HeroSection";
import ValuePillars from "@/components/portfolio/ValuePillars";
import ServicesSection from "@/components/portfolio/ServicesSection";
import ProcessSection from "@/components/portfolio/ProcessSection";
import ClientsSection from "@/components/portfolio/ClientsSection";
import { PROJECT_SLOTS, type ProjectSlot } from "@/lib/projects";
import { useKinetix } from "@/lib/store";

function SpotlightCard({
  slot,
  openProject,
}: {
  slot: ProjectSlot;
  openProject: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (slot.video && videoRef.current) {
      const p = videoRef.current.play();
      if (p !== undefined) p.catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (slot.video && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/works/${slot.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="feat-card group block relative overflow-hidden bg-void cursor-pointer"
    >
      {/* Full-bleed image — 16:10 matches the 1440x900 landscape artwork */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={slot.image}
          alt={slot.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
          loading="lazy"
          decoding="async"
        />

        {slot.video && (
          <video
            ref={videoRef}
            src={slot.video}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none hidden sm:block"
          />
        )}

        {/* Bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void via-void/70 to-transparent pointer-events-none" />

        {/* Hover overlay accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-volt group-hover:w-full transition-all duration-700 ease-out" />
      </div>

      {/* Card info — clean, minimal */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 z-10">
        <p className="font-serif italic text-sm sm:text-base text-bone/60 mb-1">
          {slot.tagline}
        </p>
        <h3 className="font-extrabold type-xwide uppercase text-2xl sm:text-4xl text-bone group-hover:text-volt transition-colors leading-none mb-3">
          {slot.name}
        </h3>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-bone/40 tracking-wider uppercase">
            {slot.category}
          </span>
          <span className="font-mono text-[10px] text-volt opacity-0 group-hover:opacity-100 transition-opacity tracking-wider uppercase">
            VIEW PROJECT ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const openProject = useKinetix((s) => s.openProject);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feat-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              scroller: scrollerEl,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const spotlightProjects = [PROJECT_SLOTS[0], PROJECT_SLOTS[2]];

  return (
    <div ref={rootRef} className="pb-12">
      {/* ──────────────────────────────────────────────── HERO */}
      <HeroSection />

      {/* ──────────────────────────────────────── VALUE PILLARS */}
      <ValuePillars />

      {/* ──────────────────────────────────────── FEATURED PROJECTS — IMAGE-FIRST, EDITORIAL */}
      <section className="px-4 sm:px-8 py-16 sm:py-24" aria-label="Featured Works">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {spotlightProjects.map((slot) => (
            <SpotlightCard key={slot.id} slot={slot} openProject={openProject} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/works"
            className="inline-block font-mono text-xs tracking-[0.2em] text-bone/50 hover:text-volt transition-colors uppercase"
          >
            ALL PROJECTS ↗
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────── SERVICES */}
      <ServicesSection />

      {/* ──────────────────────────────────────── HOW WE WORK */}
      <ProcessSection />

      {/* ──────────────────────────────────────── WHO WE WORK WITH */}
      <ClientsSection />
    </div>
  );
}
