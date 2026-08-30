"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const ITEMS: { text: string; serif?: boolean }[] = [
  { text: "Cold-pressed botanicals" },
  { text: "composed in Grasse", serif: true },
  { text: "Vegan formulas" },
  { text: "small batches, numbered", serif: true },
  { text: "Cruelty-free, always" },
  { text: "est. 2025", serif: true },
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              item.serif
                ? "mx-7 font-display text-2xl italic text-cocoa lg:mx-10 lg:text-4xl"
                : "mx-7 text-[11px] uppercase tracking-[0.32em] text-cocoa/80 lg:mx-10"
            }
          >
            {item.text}
          </span>
          <span className="text-lg text-clay" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Lite mode: static band with a fade-in entrance
      const ctx = gsap.context(() => {
        gsap.from(".marquee-band", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 94%", once: true },
        });
      }, rootRef);
      return () => ctx.revert();
    }
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      // The band settles into view as you arrive
      gsap.from(".marquee-band", {
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 94%", once: true },
      });

      const tween = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 26,
        repeat: -1,
      });

      // Let scroll velocity breathe into the marquee speed
      let decay: ReturnType<typeof setTimeout>;
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = 1 + Math.min(3.5, Math.abs(self.getVelocity()) / 700);
          gsap.to(tween, { timeScale: boost, duration: 0.25, overwrite: true });
          clearTimeout(decay);
          decay = setTimeout(() => {
            gsap.to(tween, { timeScale: 1, duration: 0.9, overwrite: true });
          }, 150);
        },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Brand values"
      className="relative overflow-x-clip py-8 lg:py-12"
    >
      <div className="marquee-band -ml-[5vw] w-[110vw] -rotate-[1.6deg] bg-blush py-5 shadow-[0_10px_30px_-20px_rgba(45,36,27,0.35)] will-change-transform lg:py-6">
        <div ref={trackRef} className="flex w-max will-change-transform">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </section>
  );
}
