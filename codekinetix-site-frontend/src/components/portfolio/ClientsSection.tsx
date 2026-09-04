"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SECTORS = [
  {
    name: "Restaurants & Dining",
    desc: "Interactive culinary storytelling, atmosphere-first aesthetics, and frictionless reservation & menu experiences.",
  },
  {
    name: "Independent Brands",
    desc: "Luxury product showcases, custom typography direction, and distinctive brand identities that build long-term equity.",
  },
  {
    name: "Creators & Studios",
    desc: "Immersive portfolios, motion archives, and interactive showcases designed to win top-tier client commissions.",
  },
  {
    name: "Tech & Modern Businesses",
    desc: "High-impact landing experiences and product demonstrations that clearly explain complex offerings.",
  },
];

export default function ClientsSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sec-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, scroller: scrollerEl, start: "top 88%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="ck-clients-section px-4 sm:px-8 py-20 sm:py-28 border-t border-bone/10 bg-void"
      aria-label="Clients & Industries"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
              WHO WE BUILD FOR.
            </h2>
          </div>
          <p className="text-bone/55 text-sm max-w-md leading-relaxed">
            We work with ambitious founders and businesses ready to set the benchmark in their respective industries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTORS.map((s) => (
            <div
              key={s.name}
              className="sec-item group p-6 sm:p-8 border border-bone/10 bg-panel/30 hover:border-volt/50 transition-colors duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-extrabold type-wide uppercase text-lg text-bone mb-2 group-hover:text-volt transition-colors">
                  {s.name}
                </h3>
                <p className="text-bone/55 text-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
