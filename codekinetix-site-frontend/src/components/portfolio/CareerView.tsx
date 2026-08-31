"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";

/**
 * CAREER — the timeline goes sideways.
 * The section pins and vertical scroll drives a horizontal ride through
 * five years, ending on YOUR project.
 */

const YEARS = [
  { year: "2021", title: "First launch", desc: "SOLO STUDIO — LOCAL CLIENTS", tag: "GENESIS", style: "panel" },
  { year: "2022", title: "Going full-stack", desc: "BOOKINGS · SHOPS · DASHBOARDS", tag: "GROWTH", style: "flame" },
  { year: "2023", title: "Motion obsession", desc: "GSAP + WEBGL EVERYWHERE", tag: "CRAFT", style: "outline" },
  { year: "2024", title: "Agency partner", desc: "WHITE-LABEL FOR STUDIOS", tag: "SCALE", style: "bone" },
  { year: "2025", title: "Live projects", desc: "WORK RUNS INSIDE THIS SITE", tag: "INNOVATION", style: "volt-year" },
  { year: "2026", title: "Your project", desc: "ONE SLOT — ONE CLIENT", tag: "NOW", style: "volt" },
];

const STYLE: Record<string, { card: string; year: string; meta: string; chip: string }> = {
  panel: { card: "bg-panel border-bone/10", year: "text-bone", meta: "text-ash", chip: "border-bone/20 text-ash" },
  flame: { card: "bg-flame border-void/20", year: "text-void", meta: "text-void/70", chip: "border-void/30 text-void/70" },
  outline: { card: "bg-panel border-bone/10", year: "text-stroke-bone", meta: "text-ash", chip: "border-bone/20 text-ash" },
  bone: { card: "bg-bone border-void/15", year: "text-void", meta: "text-void/70", chip: "border-void/30 text-void/70" },
  "volt-year": { card: "bg-panel border-bone/10", year: "text-volt", meta: "text-ash", chip: "border-bone/20 text-ash" },
  volt: { card: "bg-volt border-void/25", year: "text-void", meta: "text-void/70", chip: "border-void/30 text-void/70" },
};

export default function CareerView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let alive = true;

    const init = () => {
      if (!alive) return;
      const root = rootRef.current;
      if (!root) return;
      const scrollerEl = root.closest("main") ?? undefined;

      ctx = gsap.context(() => {
      /* header — chars tumble in */
      gsap.set(".cr-char", { yPercent: 130, rotation: () => gsap.utils.random(-18, 18) });
      gsap.fromTo(
        ".cr-reveal",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.1, ease: "power3.out" }
      );
      gsap.to(".cr-char", {
        yPercent: 0,
        rotation: 0,
        duration: 0.7,
        stagger: 0.03,
        delay: 0.18,
        ease: "back.out(1.7)",
      });

      /* the horizontal ride */
      const sticky = root.querySelector<HTMLElement>(".cr-sticky");
      const track = root.querySelector<HTMLElement>(".cr-track");
      if (sticky && track) {
        const ride = gsap.to(track, {
          x: () => -(track.scrollWidth - sticky.offsetWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".cr-hwrap",
            scroller: scrollerEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        /* ghost backdrop drifts against the ride and slowly rolls */
        gsap.fromTo(
          ".cr-ghost",
          { xPercent: 4, rotation: -2 },
          {
            xPercent: -12,
            rotation: 2,
            ease: "none",
            scrollTrigger: {
              trigger: ".cr-hwrap",
              scroller: scrollerEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        /* years parallax inside their cards as they cross the screen.
           The h3 is width-fit + centered, and the drift amplitude is
           CLAMPED to the measured slack so glyphs can never cross the
           card border at any viewport — min 4px clearance guaranteed */
        gsap.utils.toArray<HTMLElement>(".cr-card").forEach((card) => {
          const year = card.querySelector<HTMLElement>(".cr-year");
          if (!year) return;
          const amp = () => {
            const wrap = year.parentElement;
            const run = year.scrollWidth || 1;
            const slack = Math.max(0, ((wrap?.clientWidth ?? 0) - run) / 2 - 4);
            return Math.min(16, Math.max(0, (slack / run) * 100));
          };
          gsap.fromTo(
            year,
            { xPercent: () => amp() },
            {
              xPercent: () => -amp(),
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: ride,
                start: "left right",
                end: "right left",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        /* progress line */
        gsap.fromTo(
          ".cr-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".cr-hwrap",
              scroller: scrollerEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          }
        );
      }

      /* pointer tilt — the year cards lean toward the cursor as they
         ride past (desktop, motion allowed) */
      let cleanupTilt = () => {};
      if (window.matchMedia("(pointer: fine)").matches) {
        const tilts = new Map<
          HTMLElement,
          { rx: (v: number) => void; ry: (v: number) => void; rect: DOMRect | null }
        >();
        const onMove = (e: PointerEvent) => {
          const card = (e.target as HTMLElement).closest?.(".cr-card") as HTMLElement | null;
          if (!card) return;
          let t = tilts.get(card);
          if (!t) {
            gsap.set(card, { transformPerspective: 800 });
            t = {
              rx: gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3" }),
              ry: gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3" }),
              rect: card.getBoundingClientRect(),
            };
            tilts.set(card, t);
          }
          const r = t.rect ?? (t.rect = card.getBoundingClientRect());
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          t.ry(px * 7);
          t.rx(-py * 7);
        };
        const onOut = (e: PointerEvent) => {
          const card = (e.target as HTMLElement).closest?.(".cr-card") as HTMLElement | null;
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
  }, []);

  const headerLines: [string, boolean][] = [
    ["FIVE YEARS", false],
    ["OF SHIPPING", true],
  ];

  return (
    <div ref={rootRef} className="pb-32">
      {/* header */}
      <div className="px-4 sm:px-8 pt-10 sm:pt-16 mb-12 sm:mb-16">
        <p className="cr-reveal font-mono text-[10px] tracking-[0.3em] text-ash mb-4">
          <span className="text-volt font-bold">03</span> — CAREER
        </p>
        <h2 className="font-extrabold type-xwide uppercase leading-[0.92] tracking-[-0.02em] text-[13vw] sm:text-[9vw]">
          {headerLines.map(([line, isOutline], li) => (
            <span key={li} className="block overflow-hidden pb-1 whitespace-nowrap">
              {line.split("").map((ch, i) => (
                <span
                  key={i}
                  className={`cr-char inline-block ${isOutline ? "text-stroke-bone" : "text-bone"}`}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="cr-reveal font-serif italic text-2xl sm:text-3xl text-volt mt-4">
          one obsession at a time.
        </p>
      </div>

      {/* the horizontal ride */}
      <div className="cr-hwrap relative h-[300vh] sm:h-[420vh]">
        <div className="cr-sticky sticky top-0 h-[calc(100dvh-72px)] overflow-hidden flex flex-col justify-center">
          {/* ghost backdrop */}
          <span
            className="cr-ghost absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-extrabold type-xwide leading-none text-stroke-bone opacity-[0.08] text-[38vw] whitespace-nowrap select-none pointer-events-none"
            aria-hidden="true"
          >
            2021—2026
          </span>

          {/* the track */}
          <div className="cr-track flex items-center gap-4 sm:gap-6 px-4 sm:px-8 w-max">
            {/* lead card */}
            <div className="cr-card shrink-0 w-[62vw] sm:w-[26vw] h-[52vh] sm:h-[56vh] flex flex-col justify-between border border-bone/15 p-6 sm:p-8">
              <span className="font-mono text-[10px] tracking-[0.3em] text-volt">THE STORY</span>
              <div>
                <p className="font-extrabold type-wide uppercase leading-[0.95] text-3xl sm:text-4xl text-bone">
                  scroll
                  <br />
                  through
                  <br />
                  the years
                </p>
                <p className="font-mono text-[10px] tracking-[0.3em] text-bone/50 mt-5">———→</p>
              </div>
            </div>

            {YEARS.map((y, yi) => {
              const s = STYLE[y.style];
              const isCta = y.style === "volt";
              const lift = yi % 2 === 0 ? "-translate-y-4 sm:-translate-y-7" : "translate-y-4 sm:translate-y-7";
              const inner = (
                <>
                  <div className="flex items-center justify-between gap-3 font-mono text-[9px] sm:text-[11px] tracking-[0.22em]">
                    <span className={`border px-3 py-1.5 ${s.chip}`}>{y.tag}</span>
                    <span className={s.meta}>{y.year}</span>
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className={`cr-year font-extrabold type-xwide leading-none w-fit mx-auto text-[12.5vw] sm:text-[8vw] ${s.year}`}
                    >
                      {y.year}
                    </h3>
                  </div>
                  <div>
                    <p
                      className={`font-bold type-wide tracking-tight text-xl sm:text-2xl ${
                        y.style === "outline" ? "text-bone" : s.year
                      }`}
                    >
                      {y.title}
                    </p>
                    <p className={`font-mono text-[9px] sm:text-[10px] tracking-[0.22em] mt-2 ${s.meta}`}>
                      {y.desc}
                    </p>
                  </div>
                </>
              );
              return isCta ? (
                <a
                  key={y.year}
                  href="mailto:codekinetixstudio@gmail.com"
                  className={`cr-card group shrink-0 text-left w-[80vw] sm:w-[40vw] lg:w-[32vw] h-[52vh] sm:h-[56vh] flex flex-col justify-between border p-6 sm:p-8 transition-[translate,border-color,box-shadow] duration-500 hover:translate-y-0 hover:border-volt/60 hover:volt-glow active:translate-y-0 active:border-volt/60 active:volt-glow [-webkit-tap-highlight-color:transparent] ${s.card} ${lift}`}
                  aria-label={`Claim the ${y.year} slot — send an email`}
                >
                  {inner}
                  <span className="sr-only">Start a project</span>
                </a>
              ) : (
                <article
                  key={y.year}
                  className={`cr-card shrink-0 w-[80vw] sm:w-[40vw] lg:w-[32vw] h-[52vh] sm:h-[56vh] flex flex-col justify-between border p-6 sm:p-8 transition-[translate,border-color,box-shadow] duration-500 hover:translate-y-0 hover:border-volt/50 hover:volt-glow active:translate-y-0 active:border-volt/50 active:volt-glow ${s.card} ${lift}`}
                >
                  {inner}
                </article>
              );
            })}
          </div>

          {/* edge fades — hint that the ride continues */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-24 bg-gradient-to-l from-void to-transparent z-10"
            aria-hidden="true"
          />

          {/* progress + hint */}
          <div className="absolute bottom-7 left-4 right-4 sm:left-8 sm:right-8 flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-[0.3em] text-bone/50">SCROLL</span>
            <div className="flex-1 h-[2px] bg-bone/10 overflow-hidden">
              <div className="cr-progress h-full w-full origin-left bg-volt" style={{ transform: "scaleX(0)" }} />
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-volt">2021 → 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
