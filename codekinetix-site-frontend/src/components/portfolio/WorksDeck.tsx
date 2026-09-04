"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECT_SLOTS, type ProjectSlot } from "@/lib/projects";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";

function ProjectCard({
  slot,
  index,
  openProject,
}: {
  slot: ProjectSlot;
  index: number;
  openProject: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (slot.video && videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
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
      data-card={index}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="wv-card absolute inset-0 w-full h-full overflow-hidden rounded-xl group text-left border border-bone/15 bg-void shadow-2xl transform-gpu will-change-transform select-none"
      style={{
        zIndex: index + 1,
        opacity: index > 0 ? 0 : 1,
      }}
    >
      {/* ── FULL-BLEED SCREENSHOT ── */}
      <picture>
        {slot.mobileImage && (
          <source media="(max-width: 639px)" srcSet={slot.mobileImage} />
        )}
        <img
          src={slot.image}
          alt={slot.name}
          className="absolute inset-0 w-full h-full object-cover object-top sm:transition-transform sm:duration-700 sm:ease-out sm:group-hover:scale-[1.03]"
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </picture>

      {/* ── FULL-BLEED VIDEO ON HOVER ── */}
      {slot.video && (
        <video
          ref={videoRef}
          src={slot.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none z-0 hidden sm:block"
        />
      )}

      {/* Edge gradient overlays for high-contrast readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-void/90 via-void/40 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-void/95 via-void/50 to-transparent z-10" />

      {/* Dim overlay for smooth GPU-accelerated stacking fade */}
      <div className="wv-dim pointer-events-none absolute inset-0 bg-void opacity-0 z-[12]" />

      {/* Corner ticks */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-volt/80 pointer-events-none z-30" aria-hidden="true" />
      <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-volt/80 pointer-events-none z-30" aria-hidden="true" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-volt/80 pointer-events-none z-30" aria-hidden="true" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-volt/80 pointer-events-none z-30" aria-hidden="true" />

      {/* ── TOP BAR ── */}
      <div
        className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-4 sm:px-8 pt-4 sm:pt-6 font-mono text-[9px] sm:text-xs tracking-[0.25em] uppercase pointer-events-auto"
        style={{ transform: "translateZ(20px)" }}
      >
        <span className="px-3 py-1.5 bg-void/85 backdrop-blur-md rounded border border-bone/20 text-bone">
          {slot.index} — {slot.name}
        </span>
        <span className="px-3 py-1.5 bg-void/85 backdrop-blur-md rounded border border-volt/30 text-volt font-bold">
          {slot.tagline}
        </span>
      </div>

      {/* ── BOTTOM ROW WITH METADATA & ACTIONS ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 pb-4 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="max-w-md">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-ash uppercase block mb-1">
            {slot.meta}
          </span>
          <p className="font-mono text-xs text-bone/80 line-clamp-2 leading-relaxed hidden sm:block">
            {slot.description}
          </p>
        </div>

        {/* Dual Actions */}
        <div className="flex items-center gap-3 shrink-0 relative z-30 pointer-events-auto">
          <Link
            href={`/works/${slot.slug}`}
            data-cursor="open"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-bone text-void font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase hover:bg-volt transition-colors relative z-30 pointer-events-auto"
          >
            CASE STUDY ↗
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProject(slot.id);
            }}
            data-cursor="view"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-volt text-void font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase hover:bg-bone transition-colors relative z-30 pointer-events-auto"
          >
            LIVE VIEW ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorksDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const openProject = useKinetix((s) => s.openProject);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let alive = true;

    const init = () => {
      if (!alive) return;
      const root = rootRef.current;
      const wrap = wrapRef.current;
      const deck = deckRef.current;
      if (!root || !wrap || !deck) return;
      const scrollerEl = root.closest("main") ?? undefined;

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".wv-card", root);
        if (!cards.length) return;

        // Set initial positions: cards after index 0 start below viewport with opacity restored
        cards.forEach((card, i) => {
          if (i > 0) {
            gsap.set(card, { yPercent: 100, opacity: 1 });
          }
        });

        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            scroller: scrollerEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) return;
          const prevCard = cards[i - 1];
          const prevDim = prevCard.querySelector<HTMLElement>(".wv-dim");

          stackTl.to(
            prevCard,
            {
              scale: 0.94,
              duration: 1,
              ease: "power2.inOut",
            },
            i - 1
          );

          if (prevDim) {
            stackTl.to(
              prevDim,
              {
                opacity: 0.65,
                duration: 1,
                ease: "power2.inOut",
              },
              i - 1
            );
          }

          stackTl.fromTo(
            card,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 1,
              ease: "power2.inOut",
            },
            i - 1
          );
        });

        /* 3D Pointer tilt on fine pointer devices */
        if (window.matchMedia("(pointer: fine)").matches) {
          const tilts = new Map<
            HTMLElement,
            { rx: (v: number) => void; ry: (v: number) => void; rect: DOMRect | null }
          >();

          const onMove = (e: PointerEvent) => {
            const card = (e.target as HTMLElement).closest?.(".wv-card") as HTMLElement | null;
            if (!card) return;
            let t = tilts.get(card);
            if (!t) {
              gsap.set(card, { transformPerspective: 900 });
              t = {
                rx: gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" }),
                ry: gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" }),
                rect: card.getBoundingClientRect(),
              };
              tilts.set(card, t);
            }
            const r = t.rect ?? (t.rect = card.getBoundingClientRect());
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            t.ry(px * 3.5);
            t.rx(-py * 3.5);
          };

          const onOut = (e: PointerEvent) => {
            const card = (e.target as HTMLElement).closest?.(".wv-card") as HTMLElement | null;
            if (!card || card.contains(e.relatedTarget as Node)) return;
            const t = tilts.get(card);
            if (t) {
              t.rect = null;
              t.rx(0);
              t.ry(0);
            }
          };

          root.addEventListener("pointermove", onMove, { passive: true });
          root.addEventListener("pointerout", onOut, { passive: true });
        }
      }, root);
    };

    init();

    if (curtain.isCovered()) {
      curtain.whenUncovered().then(() => {
        if (alive) ScrollTrigger.refresh();
      });
    }

    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="works-deck" ref={rootRef} className="relative pt-4 pb-20">
      {/* ── PINNED STACKING DECK WRAPPER ── */}
      <div
        ref={wrapRef}
        className="wv-stack-wrap relative"
        style={{ height: `${PROJECT_SLOTS.length * 90}vh` }}
      >
        <div className="sticky top-0 h-[calc(100dvh-80px)] flex flex-col justify-center px-4 sm:px-8">
          <div
            ref={deckRef}
            className="relative w-full max-w-5xl h-[58vh] sm:h-[68vh] mx-auto overflow-hidden rounded-xl shadow-2xl border border-bone/10 bg-void"
          >
            {PROJECT_SLOTS.map((slot, i) => (
              <ProjectCard
                key={slot.id}
                slot={slot}
                index={i}
                openProject={openProject}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
