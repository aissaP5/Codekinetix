"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PRINCIPLES = [
  {
    title: "Zero Templates",
    summary: "Built completely from raw code. No generic builders, no identical-looking templates.",
  },
  {
    title: "Design Meets Code",
    summary: "Creative direction and engineering done together, so the final build looks and feels exactly right.",
  },
  {
    title: "Speed & Fluid Motion",
    summary: "60 frames per second animations with instant load times and zero unnecessary weight.",
  },
  {
    title: "Direct Access",
    summary: "Work directly with the designer and developer building your site. No middlemen or account handlers.",
  },
];

export default function ValuePillars() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".principle-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            scroller: scrollerEl,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="border-y border-bone/10 bg-panel/30 py-12 sm:py-16 px-4 sm:px-8"
      aria-label="Studio Principles"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {PRINCIPLES.map((p, idx) => (
          <div
            key={p.title}
            className="principle-item group flex flex-col justify-between"
          >
            <div>
              <span className="w-1.5 h-1.5 bg-volt rounded-full inline-block mb-4 group-hover:scale-150 transition-transform duration-300" />
              <h3 className="font-extrabold type-wide uppercase text-bone text-base sm:text-lg mb-2 group-hover:text-volt transition-colors">
                {p.title}
              </h3>
              <p className="text-bone/55 text-xs leading-relaxed">
                {p.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
