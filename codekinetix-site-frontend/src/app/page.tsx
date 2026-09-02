"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import ParticleWord from "@/components/portfolio/ParticleWord";
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
      {/* Full-bleed image */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
        <picture>
          {slot.mobileImage && (
            <source media="(max-width: 639px)" srcSet={slot.mobileImage} />
          )}
          <img
            src={slot.image}
            alt={slot.name}
            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
            loading="lazy"
            decoding="async"
          />
        </picture>

        {slot.video && (
          <video
            ref={videoRef}
            src={slot.video}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
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
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
        }
      );

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
      <section className="relative flex flex-col min-h-[90vh] px-4 sm:px-8 pt-8 pb-16 justify-between overflow-hidden">
        <div>
          <div className="hero-fade flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.3em] text-bone/50 mb-8 sm:mb-12">
            <span className="text-volt font-bold">
              AVAILABLE FOR PROJECTS
            </span>
            <span className="hidden sm:inline">DIGITAL EXPERIENCE STUDIO</span>
            <span>DESIGN × CODE × MOTION</span>
          </div>

          <div className="flex items-center justify-center my-6 sm:my-10">
            <h1 className="select-none text-center" aria-label="CodeKinetix — Digital Experience Studio">
              <span className="sr-only">
                CodeKinetix is an independent digital experience studio. We build digital experiences people remember.
              </span>
              <span className="block" aria-hidden="true">
                <ParticleWord
                  text="CODEKINETIX"
                  className="relative block w-[7.1em] h-[0.82em] text-[min(13.4vw,26vh)] sm:text-[min(12.8vw,26vh)] select-none"
                />
              </span>
            </h1>
          </div>
        </div>

        <div className="border-t border-bone/10 pt-8 sm:pt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="hero-fade max-w-2xl">
            <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] leading-[0.95] text-bone text-3xl sm:text-5xl lg:text-6xl">
              WE BUILD DIGITAL EXPERIENCES PEOPLE REMEMBER.
            </h2>
          </div>

          <div className="hero-fade flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/contact"
              data-cursor="open"
              className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-7 py-4 hover:bg-bone transition-colors uppercase flex items-center gap-2 group cursor-pointer"
            >
              START A PROJECT
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>
            <Link
              href="/works"
              className="border border-bone/25 text-bone font-mono text-xs font-bold tracking-[0.2em] px-6 py-4 hover:border-volt hover:text-volt transition-colors uppercase"
            >
              VIEW WORKS ↓
            </Link>
          </div>
        </div>
      </section>

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



      {/* ──────────────────────────────────────── CTA BANNER */}
      <section className="px-4 sm:px-8 py-20 sm:py-28 border-t border-bone/10 bg-void">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-3xl sm:text-5xl lg:text-6xl leading-[0.95] mb-6">
            LET&apos;S BUILD SOMETHING DIFFERENT.
          </h2>
          <p className="text-bone/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Tell us your brand name and what you need. We respond within 24 hours.
          </p>
          <Link
            href="/contact"
            data-cursor="open"
            className="inline-block bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-10 py-5 uppercase hover:bg-bone transition-colors"
          >
            START A PROJECT ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
