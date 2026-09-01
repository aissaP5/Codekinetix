"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const CAPABILITIES = [
  {
    title: "Brand Websites & Landing Pages",
    desc: "Memorable, high-impact digital flagships designed to position your brand at the top of its market and convert visitors into clients.",
    highlight: "Editorial design, responsive architecture, zero templates",
  },
  {
    title: "Motion & Interactive Experiences",
    desc: "Fluid 60 FPS animations, scroll-triggered storytelling, custom 3D elements, and micro-interactions that make people stop and pay attention.",
    highlight: "GSAP motion choreography, GPU-accelerated canvas, smooth physics",
  },
  {
    title: "E-Commerce & Digital Stores",
    desc: "Custom storefronts with frictionless bag drawers, elegant product galleries, and clean checkout journeys that maximize average order value.",
    highlight: "Custom cart systems, high-speed product catalogs, conversion UX",
  },
  {
    title: "Web Applications & Custom Tools",
    desc: "Full-stack client dashboards, interactive calculation tools, and bespoke software interfaces built for reliability and scale.",
    highlight: "Next.js App Router, clean APIs, secure auth, robust state",
  },
];

export default function ServicesSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cap-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: card, scroller: scrollerEl, start: "top 90%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="px-4 sm:px-8 py-20 sm:py-28"
      aria-label="Capabilities"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-bone/10 pb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase mb-2">
              STUDIO CAPABILITIES
            </p>
            <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
              WHAT WE BUILD.
            </h2>
          </div>
          <p className="text-bone/55 text-sm max-w-md leading-relaxed">
            Every project is treated as an original piece of craftsmanship — engineered from clean code to help you stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CAPABILITIES.map((c) => (
            <div
              key={c.title}
              className="cap-card group p-8 sm:p-10 border border-bone/12 bg-panel/30 hover:border-volt/60 hover:bg-panel/60 transition-all duration-400 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-extrabold type-wide uppercase text-xl sm:text-2xl text-bone group-hover:text-volt transition-colors mb-3">
                  {c.title}
                </h3>
                <p className="text-bone/60 text-sm leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-bone/8">
                <p className="font-mono text-[10px] text-bone/40 uppercase tracking-wider group-hover:text-bone/70 transition-colors">
                  {c.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-block font-mono text-xs text-bone/50 hover:text-volt transition-colors uppercase tracking-[0.2em]"
          >
            HAVE A SPECIFIC IDEA IN MIND? GET IN TOUCH ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
