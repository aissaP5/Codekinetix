"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 48, suffix: "h", label: "Dry-aged patties", note: "patience you can taste" },
  { value: 200, suffix: "°C", label: "Smash sear", note: "the maillard standard" },
  { value: 12, suffix: "", label: "Ingredients", label2: "total", note: "nothing to hide" },
  { value: 0, suffix: "", label: "Shortcuts", note: "not even one" },
];

export function StatsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-block").forEach((block, i) => {
        const numEl = block.querySelector<HTMLElement>(".stat-num");
        const target = Number(block.dataset.value);

        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
          }
        );

        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          delay: 0.2 + i * 0.1,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            if (numEl) numEl.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
        });
      });

      /* background word drift */
      gsap.to(".stats-bgword", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative py-20 md:py-32 px-5 md:px-10 border-y border-line overflow-hidden"
      aria-label="SMASH'D by the numbers"
    >
      {/* giant background word */}
      <span
        className="stats-bgword font-display absolute top-1/2 -translate-y-1/2 left-0 text-[38vw] leading-none text-foreground/[0.035] whitespace-nowrap pointer-events-none select-none"
        aria-hidden="true"
      >
        OBSESSED
      </span>

      <div className="relative max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-10">
        {STATS.map((s) => (
          <div key={s.label} className="stat-block" data-value={s.value}>
            <div className="font-display leading-none text-foreground flex items-baseline">
              <span className="stat-num text-[clamp(3.5rem,8vw,7.5rem)]">0</span>
              <span className="text-ember text-[clamp(1.6rem,3.5vw,3rem)]">{s.suffix}</span>
            </div>
            <p className="font-sans text-xs md:text-sm tracking-[0.22em] uppercase text-foreground/80 mt-3">
              {s.label}
            </p>
            <p className="font-sans text-[11px] md:text-xs text-smoke mt-1.5 italic">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
