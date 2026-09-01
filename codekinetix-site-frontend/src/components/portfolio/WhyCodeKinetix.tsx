"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const REASONS = [
  {
    num: "01",
    title: "NO TEMPLATES",
    statement: "Every project is designed around the business.",
    description:
      "We don't buy generic theme files or repurpose cookie-cutter templates. Every layout, typography scale, and color system is engineered specifically for your brand.",
  },
  {
    num: "02",
    title: "PERFORMANCE FIRST",
    statement: "Fast, responsive and optimized.",
    description:
      "We treat performance as a foundational feature, not an afterthought. Clean semantic trees, GPU-accelerated transforms, and sub-second initial loads on all networks.",
  },
  {
    num: "03",
    title: "DESIGN × CODE",
    statement: "Design and technology built together.",
    description:
      "Our creative coders design with implementation in mind, ensuring no visual nuance or micro-interaction gets lost in translation between Figma and production.",
  },
  {
    num: "04",
    title: "MOTION WITH PURPOSE",
    statement: "Animation enhances the experience instead of distracting from it.",
    description:
      "Every transition, cursor reaction, and scroll-linked timeline guides user attention, clarifies hierarchy, and makes your brand unforgettable.",
  },
  {
    num: "05",
    title: "DIRECT COLLABORATION",
    statement: "Simple communication with the people actually building the project.",
    description:
      "You speak directly with the creators shaping your site. No layers of non-technical project managers slowing down execution or diluting feedback.",
  },
];

export default function WhyCodeKinetix() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: "top 85%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="px-4 sm:px-8 py-20 sm:py-28 border-t border-bone/10 bg-void"
      aria-label="Why CodeKinetix"
    >
      <div className="max-w-3xl mb-14">
        <p className="font-mono text-[10px] tracking-[0.35em] text-volt uppercase mb-3 flex items-center gap-2.5">
          <span className="w-2 h-2 bg-volt rotate-45 inline-block" />
          WHY CODEKINETIX
        </p>
        <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-3xl sm:text-5xl lg:text-6xl leading-[0.95] mb-6">
          NOT YOUR TYPICAL FREELANCE AGENCY.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-bone/65 leading-relaxed">
          We operate as an agile creative coding unit. We build immersive websites, bespoke storefronts, and digital experiences that leave a lasting mark.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {REASONS.map((r, i) => (
          <div
            key={r.num}
            className={`why-card group relative p-6 sm:p-8 bg-panel/60 border border-bone/10 hover:border-volt/60 transition-all duration-400 flex flex-col justify-between ${
              i === 0 ? "lg:col-span-2" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ash mb-8">
                <span className="text-volt font-bold">{r.num} // VALUE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-bone/30 group-hover:bg-volt transition-colors" />
              </div>
              <h3 className="font-extrabold type-wide uppercase text-xl sm:text-2xl text-bone mb-2 group-hover:text-volt transition-colors">
                {r.title}
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-bone/90 mb-4">
                &ldquo;{r.statement}&rdquo;
              </p>
              <p className="font-mono text-xs text-bone/60 leading-relaxed">
                {r.description}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-bone/10 flex items-center justify-between text-bone/30 text-xs font-mono">
              <span>PRINCIPLE #{r.num}</span>
              <span className="group-hover:translate-x-1 transition-transform text-volt">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
