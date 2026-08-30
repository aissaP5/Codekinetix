"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO =
  "We believe skincare is not routine. It is ritual — a daily return to yourself. Every LUMÉA formula is cold-pressed in small batches, blended from botanicals grown to be listened to, and nothing — nothing — that does not serve your skin.";

const STATS = [
  { value: 98, suffix: "%", label: "Ingredients of natural origin" },
  { value: 12, suffix: "", label: "Botanical actives per formula" },
  { value: 0, suffix: "", label: "Sulfates, silicones, compromises" },
];

export default function Philosophy() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lite = prefersReducedMotion();

      // Manifesto — words brighten as you read (opacity-only, works in lite too)
      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".manifesto",
            start: "top 78%",
            end: "bottom 45%",
            scrub: lite ? false : 0.6,
          },
        }
      );

      if (lite) {
        // Counters still count — numbers changing is not motion
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
          const target = Number(el.dataset.value ?? 0);
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          });
        });
        return;
      }

      // Overlapping images drift at different speeds
      gsap.fromTo(
        ".philo-img-main",
        { yPercent: -6 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".philo-images",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".philo-img-small",
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: ".philo-images",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Counters
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.8,
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
    <section ref={rootRef} id="philosophy" className="relative py-28 lg:py-44">
      <div className="container-lumea grid items-start gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="eyebrow">Philosophy — 01</p>
          <p className="manifesto mt-9 font-display text-[clamp(1.55rem,2.9vw,2.55rem)] font-light leading-[1.3] text-cocoa">
            {MANIFESTO.split(" ").map((word, i) => (
              <span key={i} className="manifesto-word inline-block">
                {word}
                {"\u00A0"}
              </span>
            ))}
          </p>

          <div className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-cocoa/10 pt-10 lg:mt-24">
            {STATS.map((stat, i) => (
              <div key={i}>
                <p className="font-display text-5xl font-light text-cocoa lg:text-6xl">
                  <span
                    className="stat-value"
                    data-value={stat.value}
                    aria-label={`${stat.value}${stat.suffix}`}
                  >
                    0
                  </span>
                  <span className="text-clay">{stat.suffix}</span>
                </p>
                <p className="mt-3 text-[10px] uppercase leading-relaxed tracking-[0.18em] text-taupe">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="philo-images relative lg:col-span-6">
          <figure className="philo-img-main relative aspect-[7/5] w-full overflow-hidden rounded-[6px] will-change-transform">
            <div className="absolute inset-0">
              <Image
                src="/images/botanical.png"
                alt="Flat lay of LUMÉA botanicals — rose petals, peony and golden oil on linen"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
          <figure className="philo-img-small absolute -bottom-14 -left-2 w-[46%] rotate-[-5deg] bg-cream p-3 pb-8 shadow-[0_30px_60px_-30px_rgba(45,36,27,0.45)] will-change-transform sm:-left-8 lg:-left-14">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/texture.png"
                alt="Macro of an ivory cream texture swatch"
                fill
                sizes="(min-width: 1024px) 22vw, 46vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center font-display text-sm italic text-taupe">
              Céleste, batch N°214
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
