"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECT_SLOTS, type ProjectSlot } from "@/lib/projects";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";
import WorksDeck from "@/components/portfolio/WorksDeck";

const CATEGORIES = ["ALL", "E-COMMERCE", "EXPERIENCE", "DINING & HOSPITALITY", "HEALTHCARE", "FOOD"];

function GridCard({
  slot,
  openProject,
}: {
  slot: ProjectSlot;
  openProject: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (slot.video && videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    }
  };

  const handleMouseLeave = () => {
    if (slot.video && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="work-item-card group border border-bone/15 bg-panel/50 overflow-hidden flex flex-col justify-between hover:border-volt/70 transition-all duration-400 cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        <img
          src={slot.image}
          alt={slot.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
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
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-80 pointer-events-none" />
        <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase px-3 py-1 bg-void/80 backdrop-blur-md border border-bone/15 text-bone pointer-events-none">
          {slot.category}
        </span>
        <span className="absolute top-4 right-4 font-mono text-[9px] tracking-widest text-volt pointer-events-none">
          {slot.index} //
        </span>
      </div>

      <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-extrabold type-xwide uppercase text-2xl sm:text-3xl text-bone mb-2 group-hover:text-volt transition-colors">
            {slot.name}
          </h3>
          <p className="font-serif italic text-base text-bone/75 mb-4">
            {slot.tagline}
          </p>
          <p className="font-mono text-xs text-bone/60 leading-relaxed line-clamp-2 mb-6">
            {slot.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {slot.caseStudy.technology.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 bg-void border border-bone/10 text-bone/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-bone/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProject(slot.id);
            }}
            className="font-mono text-[10px] tracking-widest uppercase text-volt hover:text-bone transition-colors font-bold"
          >
            LIVE VIEW ↗
          </button>
          <Link
            href={`/works/${slot.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-[10px] tracking-widest uppercase text-bone hover:text-volt transition-colors font-bold"
          >
            EXPLORE CASE STUDY ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WorksPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const openProject = useKinetix((s) => s.openProject);
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");

  const filtered =
    selectedCat === "ALL"
      ? PROJECT_SLOTS
      : PROJECT_SLOTS.filter((s) => s.category === selectedCat);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let alive = true;

    const init = () => {
      if (!alive) return;
      const root = rootRef.current;
      if (!root) return;
      const scrollerEl = root.closest("main") ?? undefined;

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".work-item-card").forEach((card) => {
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
    };

    if (curtain.isCovered()) {
      curtain.whenUncovered().then(() => {
        if (alive) init();
      });
    } else {
      init();
    }

    return () => {
      alive = false;
      ctx?.revert();
    };
  }, [selectedCat, viewMode]);

  return (
    <div ref={rootRef} className="pb-8 sm:pb-12">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-10 sm:pt-16 pb-8">
        <div className="max-w-4xl mb-10">
          <h1 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
            SELECTED WORKS.
          </h1>
          <p className="font-mono text-xs sm:text-sm text-bone/65 leading-relaxed max-w-2xl">
            Explore our curated portfolio of bespoke digital experiences, clinical atlases, 100-frame video scrub engines, and high-fashion e-commerce. Every build is engineered from scratch.
          </p>
        </div>

        {/* Filter controls & view mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  if (cat !== "ALL") setViewMode("grid");
                }}
                className={`font-mono text-[10px] sm:text-xs tracking-wider uppercase px-4 py-2 border transition-all ${selectedCat === cat
                    ? "bg-volt text-void border-volt font-bold shadow-[0_0_20px_rgba(58,111,255,0.4)]"
                    : "bg-void text-bone/60 border-bone/15 hover:border-bone/40 hover:text-bone"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                setViewMode("deck");
                setSelectedCat("ALL");
              }}
              className={`px-3 py-1.5 border uppercase transition-colors ${viewMode === "deck"
                  ? "border-volt text-volt font-bold"
                  : "border-bone/20 text-bone/50 hover:text-bone"
                }`}
            >
              STACK DECK
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 border uppercase transition-colors ${viewMode === "grid"
                  ? "border-volt text-volt font-bold"
                  : "border-bone/20 text-bone/50 hover:text-bone"
                }`}
            >
              GRID VIEW
            </button>
          </div>
        </div>
      </div>

      {/* View Mode 1: 3D Stacking Deck */}
      {viewMode === "deck" && selectedCat === "ALL" ? (
        <WorksDeck />
      ) : (
        /* View Mode 2: Expanded Large Grid */
        <div className="px-4 sm:px-8 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filtered.map((slot) => (
            <GridCard
              key={slot.id}
              slot={slot}
              openProject={openProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
