"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PROJECT_SLOTS, type ProjectSlot } from "@/lib/projects";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";

/**
 * WORKS — pinned stacking cards.
 *
 * Sized with a clean maximum width and height so it feels like
 * an elevated card deck in the center of the screen.
 * Card 1 is visible first; scrolling slides card 2 over card 1,
 * then card 3 over card 2, etc.
 */

const TREATMENTS = [
  { chip: "border-bone/25 text-bone/80", meta: "text-bone/70" },
  { chip: "border-bone/25 text-bone/80", meta: "text-bone/70" },
  { chip: "border-bone/25 text-bone/80", meta: "text-bone/70" },
  { chip: "border-bone/25 text-bone/80", meta: "text-bone/70" },
  { chip: "border-bone/25 text-bone/80", meta: "text-bone/70" },
];

function ProjectCard({
  slot,
  index,
  treatment,
  openProject,
}: {
  slot: ProjectSlot;
  index: number;
  treatment: (typeof TREATMENTS)[number];
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

  const handleClick = () => {
    if (slot.video && videoRef.current) {
      videoRef.current.pause();
    }
    openProject(slot.id);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="wv-card absolute inset-0 w-full h-full overflow-hidden rounded-xl group text-left focus-visible:outline-2 focus-visible:outline-volt transition-shadow duration-500 hover:volt-glow active:volt-glow border border-bone/15 bg-void shadow-2xl transform-gpu will-change-transform"
      style={{ zIndex: index + 1 }}
      aria-label={`Open the ${slot.name} project`}
    >
      {/* ── FULL-BLEED SCREENSHOT — mobile-native portrait on small screens ── */}
      {slot.image && (
        <picture>
          {slot.mobileImage && (
            <source media="(max-width: 639px)" srcSet={slot.mobileImage} />
          )}
          <img
            src={slot.image}
            alt={slot.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
          />
        </picture>
      )}

      {/* ── FULL-BLEED VIDEO (desktop hover only) ── */}
      {slot.video && (
        <video
          ref={videoRef}
          src={slot.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none hidden sm:block"
        />
      )}

      {/* Edge gradients for text readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-void/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-void/75 to-transparent" />

      {/* ── TOP ROW ── */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-3 sm:px-7 pt-3 sm:pt-6 font-mono text-[8.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em]">
        <span className={`border px-2.5 py-1 sm:px-3 sm:py-1.5 bg-void/85 sm:bg-void/60 sm:backdrop-blur-md rounded ${treatment.chip}`}>
          {slot.index} — {slot.name}
        </span>
        <span className={`bg-void/85 sm:bg-void/60 sm:backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded truncate max-w-[140px] sm:max-w-none ${treatment.meta}`}>
          {slot.tagline}
        </span>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 px-3 sm:px-7 pb-3 sm:pb-6">
        <span className={`font-mono text-[8.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] bg-void/85 sm:bg-void/60 sm:backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded border border-bone/10 ${treatment.meta}`}>
          {slot.meta}
        </span>
        <span
          className="grid place-items-center w-8 h-8 sm:w-12 sm:h-12 border border-bone/30 bg-void/85 sm:bg-void/60 sm:backdrop-blur-md text-bone font-bold text-sm sm:text-lg rounded-full group-hover:rotate-45 group-hover:bg-volt group-hover:text-void group-hover:border-volt transition-all duration-500"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>

      {/* Dim overlay for smooth GPU-accelerated stacking fade */}
      <div className="wv-dim pointer-events-none absolute inset-0 bg-void opacity-0 z-[12]" />

      {/* Shine sweep */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-bone/15 to-transparent -translate-x-[320%] group-hover:translate-x-[420%] transition-transform duration-[1100ms] ease-out"
        aria-hidden="true"
      />

      {/* Corner ticks */}
      <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-bone/40 pointer-events-none" aria-hidden="true" />
      <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-bone/40 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-bone/40 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-bone/40 pointer-events-none" aria-hidden="true" />
    </button>
  );
}

export default function WorksView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const openProject = useKinetix((s) => s.openProject);


  const totalCards = PROJECT_SLOTS.length + 1;

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let alive = true;

    const init = () => {
      if (!alive) return;
      const root = rootRef.current;
      const deck = deckRef.current;
      if (!root || !deck) return;
      const scrollerEl = root.closest("main") ?? undefined;

      ctx = gsap.context(() => {
        /* header — masked char rise */
        gsap.set(".wv-head-char", { yPercent: 115 });
        gsap.set([".wv-head-label", ".wv-head-side"], { opacity: 0, y: 16 });
        const tl = gsap.timeline({ delay: 0.05 });
        tl.to(".wv-head-label", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
          .to(".wv-head-char", { yPercent: 0, duration: 0.85, stagger: 0.06, ease: "power4.out" }, "-=0.2")
          .to(".wv-head-side", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.4");

        /* ── PINNED STACKING DECK ── */
        const cards = gsap.utils.toArray<HTMLElement>(".wv-card");

        cards.forEach((card, i) => {
          if (i > 0) {
            gsap.set(card, { yPercent: 100 });
          }
        });

        const getStepDistance = () => (window.innerWidth < 640 ? 440 : 620);

        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger: deck,
            scroller: scrollerEl,
            start: "center center",
            end: () => `+=${(totalCards - 1) * getStepDistance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
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
            (i - 1)
          );

          if (prevDim) {
            stackTl.to(
              prevDim,
              {
                opacity: 0.65,
                duration: 1,
                ease: "power2.inOut",
              },
              (i - 1)
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
            (i - 1)
          );
        });

        /* pointer tilt */
        let cleanupTilt = () => {};
        if (window.matchMedia("(pointer: fine)").matches) {
          const tilts = new Map<
            HTMLElement,
            { rx: (v: number) => void; ry: (v: number) => void }
          >();
          const onMove = (e: PointerEvent) => {
            const card = (e.target as HTMLElement).closest?.(".wv-card") as HTMLElement | null;
            if (!card) return;
            let t = tilts.get(card);
            if (!t) {
              gsap.set(card, { transformPerspective: 900 });
              t = {
                rx: gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3" }),
                ry: gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3" }),
              };
              tilts.set(card, t);
            }
            const r = card.getBoundingClientRect();
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
              t.rx(0);
              t.ry(0);
            }
          };
          root.addEventListener("pointermove", onMove, { passive: true });
          root.addEventListener("pointerout", onOut, { passive: true });
          cleanupTilt = () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerout", onOut);
            tilts.clear();
          };
        }
        return cleanupTilt;
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
  }, [totalCards]);

  return (
    <div ref={rootRef} className="pt-8 sm:pt-14 pb-20">
      {/* header */}
      <div className="px-4 sm:px-8 max-w-6xl mx-auto mb-8 sm:mb-12 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
        <div>
          <p className="wv-head-label font-mono text-[10px] tracking-[0.3em] text-ash mb-2 sm:mb-4">
            <span className="text-volt font-bold">02</span> — WORKS
          </p>
          <h2 className="font-extrabold type-xwide uppercase leading-[0.92] tracking-[-0.02em] text-[13vw] sm:text-[8vw]">
            <span className="inline-flex">
              {"WORKS".split("").map((ch, i) => (
                <span key={i} className="overflow-hidden inline-block">
                  <span className="wv-head-char inline-block">{ch}</span>
                </span>
              ))}
            </span>
            <span className="font-serif italic font-normal normal-case tracking-normal text-volt text-[0.4em] align-baseline ml-3">
              (live)
            </span>
          </h2>
        </div>
        <p className="wv-head-side max-w-[230px] font-mono text-[9px] sm:text-[10px] leading-relaxed text-ash">
          EVERY PROJECT OPENS INSIDE THIS SITE — CLICK A CARD AND STEP IN.
        </p>
      </div>

      {/* ── THE PINNED DECK — vertical card proportion on mobile, balanced on desktop ── */}
      <div className="px-4 sm:px-8">
        <div
          ref={deckRef}
          className="relative w-full max-w-5xl h-[58vh] sm:h-[68vh] mx-auto overflow-hidden rounded-xl shadow-2xl"
        >
          {PROJECT_SLOTS.map((slot, i) => {
            const t = TREATMENTS[i % TREATMENTS.length];
            return (
              <ProjectCard
                key={slot.id}
                slot={slot}
                index={i}
                treatment={t}
                openProject={openProject}
              />
            );
          })}

          {/* Open slot — final card */}
          <a
            href="mailto:codekinetixstudio@gmail.com"
            className="wv-card absolute inset-0 w-full h-full overflow-hidden rounded-xl group block text-left focus-visible:outline-2 focus-visible:outline-volt transition-shadow duration-500 hover:volt-glow active:volt-glow [-webkit-tap-highlight-color:transparent] [touch-action:manipulation]"
            style={{ zIndex: totalCards }}
            aria-label="Start a project — send an email"
          >
            <div className="absolute inset-0 bg-volt" />
            <div className="wv-dim pointer-events-none absolute inset-0 bg-void opacity-0 z-[12]" />
            <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-8 text-void">
              <div className="flex items-center justify-between gap-2 font-mono text-[8.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-void/70">
                <span className="border border-void/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded">SLOT {String(totalCards).padStart(2, "0")} — OPEN</span>
                <span className="truncate">ONE CLIENT PER QUARTER</span>
              </div>

              <div className="relative grid place-items-center flex-1 overflow-hidden py-2">
                <div className="text-center group-hover:scale-[1.03] transition-transform duration-700 select-none">
                  <span className="font-extrabold type-xwide uppercase leading-[0.88] block text-[clamp(3.2rem,14vw,8rem)] tracking-[-0.02em]">
                    YOURS
                  </span>
                  <span className="font-serif italic font-normal normal-case block text-[clamp(1.4rem,5.5vw,3.2rem)] text-void/80 mt-1">
                    maybe
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 bg-void text-volt font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.15em] px-3.5 py-2 sm:px-5 sm:py-3 rounded-full group-hover:gap-3 transition-all duration-400">
                  START A PROJECT
                  <span aria-hidden="true">↗</span>
                </span>
                <span className="font-mono text-[8.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-void/70">
                  FIXED QUOTE IN 48H
                </span>
              </div>
            </div>

            <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-void/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-void/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-void/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-void/40 pointer-events-none" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
