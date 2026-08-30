"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    no: "01",
    title: "Cleanse",
    copy: "Melt the day away with Tendre, our oil-to-milk cleanser. Warmth is the first act of care — take your time.",
    product: "Tendre — Cleansing Oil",
  },
  {
    no: "02",
    title: "Treat",
    copy: "Press three drops of Éclat into damp skin, from the centre of the face outward. Let the serum listen before it works.",
    product: "Éclat — Radiance Serum",
  },
  {
    no: "03",
    title: "Seal",
    copy: "Sculpt Céleste upward along the jaw and cheekbones. Dew is not a finish — it is a state of skin.",
    product: "Céleste — Hydrating Cream",
  },
];

export default function Ritual() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: gentle fades
      if (prefersReducedMotion()) {
        gsap.utils.toArray<HTMLElement>(".ritual-step").forEach((step) => {
          gsap.from(step.children, {
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: step, start: "top 84%", once: true },
          });
        });
        return;
      }

      gsap.utils.toArray<HTMLElement>(".ritual-step").forEach((step) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 80%", once: true },
        });
        tl.fromTo(
          step.querySelector(".ritual-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" }
        )
          .fromTo(
            step.querySelector(".ritual-dot"),
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: "back.out(2)" },
            0.95
          )
          .fromTo(
            step.querySelector(".ritual-no"),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
            0.25
          )
          .fromTo(
            step.querySelectorAll(".ritual-body > *"),
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.09 },
            0.4
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="ritual" className="relative bg-linen py-28 lg:py-44">
      <div className="container-lumea">
        <header className="max-w-2xl">
          <p className="eyebrow">The Ritual — Morning & Evening</p>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-light leading-[1.02] text-cocoa">
            Three movements,
            <br />
            <em className="italic text-clay">twice a day.</em>
          </h2>
        </header>

        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-12 lg:mt-24">
          {STEPS.map((step) => (
            <div key={step.no} className="ritual-step">
              <div className="relative">
                <div className="ritual-line h-px w-full origin-left bg-cocoa/20" />
                <span className="ritual-dot absolute -top-[4.5px] left-0 block size-[9px] rounded-full bg-clay" />
              </div>
              <div className="pt-10">
                <p className="ritual-no font-display text-6xl font-light italic leading-none text-clay/70 lg:text-7xl">
                  {step.no}
                </p>
                <div className="ritual-body mt-8">
                  <h3 className="font-display text-3xl text-cocoa">{step.title}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-7 text-taupe">
                    {step.copy}
                  </p>
                  <p className="mt-7 text-[9px] uppercase tracking-[0.28em] text-cocoa/60">
                    {step.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
