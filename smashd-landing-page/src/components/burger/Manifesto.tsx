"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE_1 = ["WE", "DON'T", "COOK", "BURGERS."];
const LINE_2 = ["WE", "SMASH", "THEM", "—", "WITH", "INTENT."];

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mf-word",
        { yPercent: 120, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          stagger: 0.055,
          ease: "power4.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        }
      );
      gsap.fromTo(
        ".mf-sub",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
        }
      );
      gsap.to(".mf-bg", {
        scale: 1.15,
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
      className="relative py-28 md:py-44 px-5 md:px-10 overflow-hidden"
      aria-label="Manifesto"
    >
      <div
        className="mf-bg absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(255,92,31,0.07), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="font-display leading-[1.02] text-[clamp(2.2rem,7vw,6.5rem)]">
          <span className="block">
            {LINE_1.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em]">
                <span className="mf-word inline-block text-foreground">{w}</span>
              </span>
            ))}
          </span>
          <span className="block mt-2">
            {LINE_2.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em]">
                <span className={`mf-word inline-block ${w === "SMASH" ? "text-ember" : w === "INTENT." ? "text-stroke" : "text-foreground"}`}>
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h2>
        <p className="mf-sub font-sans text-sm md:text-base text-foreground/55 max-w-lg mx-auto mt-10 leading-relaxed">
          A smashed burger isn&apos;t a style — it&apos;s a stance. Maximum
          crust, maximum flavor, zero apologies. Every layer earns its place,
          and every smash has a reason.
        </p>
      </div>
    </section>
  );
}
