"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  {
    index: "01",
    title: "BUTTER LETTUCE",
    desc: "Hand-torn every hour, never shredded. If it doesn't snap when you bite, it doesn't make the burger. We taste it every shift — the day it stops being crisp is the day we close the kitchen.",
    img: "/burger/lettuce.webp",
    alt: "A sheet of crisp butter lettuce",
    tilt: -3,
  },
  {
    index: "02",
    title: "HEIRLOOM TOMATO",
    desc: "Vine-ripened and cut twelve millimeters thick — thick enough to matter, thin enough to melt into the stack. Never refrigerated, because cold is where flavor goes to die.",
    img: "/burger/tomato.webp",
    alt: "Slices of ripe heirloom tomato",
    tilt: 2.5,
  },
  {
    index: "03",
    title: "AGED CHEDDAR",
    desc: "Eighteen months in the cave, grated fresh, laid double. It doesn't just melt — it cascades. Watch it drape over the patty like it was born there.",
    img: "/burger/cheese.webp",
    alt: "Melted aged cheddar with drips",
    tilt: -2,
  },
  {
    index: "04",
    title: "SMASHED ANGUS",
    desc: "A 200g blend of dry-aged chuck and brisket, smashed hard on a 200°C plancha for ten seconds. That thin, lacy, caramelized crust is the whole point — the maillard reaction doesn't negotiate.",
    img: "/burger/patty.webp",
    alt: "Smashed angus beef patty with seared crust",
    tilt: 3,
  },
];

export function StackSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* header reveal */
      gsap.fromTo(
        ".stack-header .char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.03,
          ease: "power4.out",
          scrollTrigger: { trigger: ".stack-header", start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".stack-intro",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stack-header", start: "top 75%" },
        }
      );

      /* rows */
      gsap.utils.toArray<HTMLElement>(".stack-row").forEach((row, i) => {
        const isEven = i % 2 === 0;

        gsap.fromTo(
          row.querySelectorAll(".reveal-line"),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: { trigger: row, start: "top 78%" },
          }
        );
        gsap.fromTo(
          row.querySelectorAll(".row-meta"),
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 72%" },
          }
        );
        gsap.fromTo(
          row.querySelector(".ingredient-card"),
          {
            clipPath: isEven
              ? "inset(0 100% 0 0 round 14px)"
              : "inset(0 0 0 100% round 14px)",
          },
          {
            clipPath: "inset(0 0% 0 0 round 14px)",
            duration: 1.1,
            ease: "power4.inOut",
            scrollTrigger: { trigger: row, start: "top 70%" },
          }
        );

        /* parallax drift at different speeds */
        gsap.fromTo(
          row.querySelector(".ingredient-card"),
          { y: isEven ? 60 : -40 },
          {
            y: isEven ? -60 : 40,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        /* idle float */
        gsap.to(row.querySelector(".ingredient-inner"), {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.8 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="stack" className="relative py-24 md:py-40 px-5 md:px-10">
      {/* header */}
      <div className="stack-header max-w-7xl mx-auto mb-16 md:mb-28">
        <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember mb-4 md:mb-6">
          (Built from the bun up)
        </p>
        <h2 className="font-display leading-[0.9] text-[clamp(3rem,10vw,10rem)]">
          <span className="block overflow-hidden">
            {"THE".split("").map((c, i) => (
              <span key={i} className="char inline-block text-foreground">
                {c}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden">
            {"STACK".split("").map((c, i) => (
              <span key={i} className="char inline-block text-stroke">
                {c}
              </span>
            ))}
          </span>
        </h2>
        <p className="stack-intro font-sans text-sm md:text-base text-foreground/60 max-w-md mt-6 md:mt-8 leading-relaxed">
          Four ingredients that do the heavy lifting. Everything else is just
          there to hold them together.
        </p>
      </div>

      {/* rows */}
      <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-40">
        {ROWS.map((row, i) => (
          <div
            key={row.index}
            className={`stack-row grid md:grid-cols-2 gap-8 md:gap-14 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* text */}
            <div className={i % 2 === 1 ? "md:text-left md:pl-10" : "md:text-right md:pr-10"}>
              <span className="row-meta font-display text-ember text-5xl md:text-7xl leading-none block mb-4">
                {row.index}
              </span>
              <h3 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] text-foreground">
                <span className="block overflow-hidden">
                  <span className="reveal-line inline-block">{row.title}</span>
                </span>
              </h3>
              <p className="row-meta font-sans text-sm md:text-base text-foreground/60 leading-relaxed mt-4 md:mt-6 max-w-md md:inline-block">
                {row.desc}
              </p>
            </div>

            {/* image — the actual layer asset */}
            <div className="ingredient-card relative" style={{ rotate: `${row.tilt}deg` }}>
              <div className="ingredient-inner will-change-transform">
                <div className="relative rounded-2xl overflow-hidden border border-line bg-[#12100c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                  <img
                    src={row.img}
                    alt={row.alt}
                    className="w-full h-auto block"
                    loading="lazy"
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(255,140,40,0.08), transparent 40%)",
                    }}
                  />
                </div>
                <span className="absolute -top-3 -right-3 font-sans text-[9px] tracking-[0.25em] uppercase bg-ember text-ink font-bold px-2.5 py-1 rounded-full rotate-3">
                  Real layer
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
