"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./reveal";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
  { name: "Rosehip Oil", origin: "Chilean Andes — cold-pressed", pct: 22 },
  { name: "Plant Squalane", origin: "Mediterranean olive", pct: 18 },
  { name: "Camellia Sinensis", origin: "Shizuoka, first flush", pct: 14 },
  { name: "Vitamin C — THD", origin: "Stabilised, lab-pure", pct: 10 },
  { name: "Evening Primrose", origin: "Provence, dusk-harvested", pct: 8 },
  { name: "Rose Absolue", origin: "Grasse, our own field", pct: 4 },
];

export default function Ingredients() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: fades + bar fills + counters, no clip wipe or parallax
      if (prefersReducedMotion()) {
        gsap.from(".ing-fig", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ing-fig", start: "top 86%", once: true },
        });
        gsap.from(".ing-row", {
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ing-list", start: "top 82%", once: true },
        });
        gsap.fromTo(
          ".ing-fill",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ".ing-list", start: "top 78%", once: true },
          }
        );
        gsap.utils.toArray<HTMLElement>(".ing-pct").forEach((el) => {
          const target = Number(el.dataset.value ?? 0);
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          });
        });
        return;
      }

      // Product image — clip reveal with settling parallax
      gsap.fromTo(
        ".ing-fig",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".ing-fig", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".ing-fig-img",
        { scale: 1.28, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".ing-fig",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Ledger rows rise
      gsap.from(".ing-row", {
        y: 44,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".ing-list", start: "top 80%", once: true },
      });

      // Percentage bars draw across
      gsap.fromTo(
        ".ing-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          stagger: 0.09,
          scrollTrigger: { trigger: ".ing-list", start: "top 75%", once: true },
        }
      );

      // Percentages count up
      gsap.utils.toArray<HTMLElement>(".ing-pct").forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(state.v));
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="ingredients" className="relative py-28 lg:py-44">
      <div className="container-lumea grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Sticky intro */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow">Inside the bottle — N°01 Éclat</p>
              <h2 className="mt-6 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[1.03] text-cocoa">
                Twelve botanicals,
                <br />
                <em className="italic text-clay">one intention.</em>
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-7 text-taupe">
                Every drop of Éclat is pressed, weighed and blended by hand in
                our Grasse atelier. No fillers, no fragrance theatre — a
                botanical is admitted only if it earns its place on your skin.
              </p>
            </Reveal>

            <figure className="ing-fig relative mt-12 aspect-[4/3] w-full overflow-hidden rounded-[6px] will-change-[clip-path]">
              <div className="ing-fig-img absolute inset-0 will-change-transform">
                <Image
                  src="/images/product-serum.png"
                  alt="Éclat radiance serum in its amber glass bottle"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-sm text-xs leading-6 text-taupe/80">
                The remaining 24% — a base of golden jojoba and cold-pressed
                chamomile. Nothing else. Ever.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Ingredient ledger */}
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <div className="flex items-baseline justify-between border-b border-cocoa/15 pb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">
                Botanical
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">
                Of formula
              </p>
            </div>
          </Reveal>

          <div className="ing-list">
            {INGREDIENTS.map((ing, i) => (
              <div key={ing.name} className="ing-row border-b border-cocoa/10 py-7">
                <div className="flex items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-sm italic text-clay/70">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="font-display text-2xl leading-none text-cocoa">
                        {ing.name}
                      </p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
                        {ing.origin}
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-3xl text-cocoa">
                    <span className="ing-pct" data-value={ing.pct}>
                      0
                    </span>
                    <span className="text-clay">%</span>
                  </p>
                </div>
                <div className="mt-5 h-[2px] w-full bg-cocoa/10">
                  <div
                    className="ing-fill h-[2px] origin-left bg-clay"
                    style={{ width: `${ing.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 text-xs leading-6 text-taupe/80">
              Full INCI lists accompany every order — and live on each carton,
              printed in ink we mix ourselves.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
