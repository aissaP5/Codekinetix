"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./reveal";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    tag: "Philosophy",
    title: "On Slowness",
    excerpt:
      "Why we cold-press in a world that runs hot — a case for patience, in formulation as in life.",
    time: "4 min read",
    image: "/images/journal-slowness.png",
    alt: "Morning light through linen curtains onto a travertine ledge with rose tea",
  },
  {
    tag: "Atelier",
    title: "The Language of Skin",
    excerpt:
      "Notes from Camille's bench — learning to read the barrier before writing a single formula.",
    time: "6 min read",
    image: "/images/journal-atelier.png",
    alt: "A perfumer's atelier bench with beakers, droppers and botanicals",
  },
  {
    tag: "Harvest",
    title: "Grasse in First Light",
    excerpt:
      "Spring harvest journal — roses picked at four in the morning, when the oil is loudest.",
    time: "3 min read",
    image: "/images/journal-grasse.png",
    alt: "Dew-covered blush roses at dawn in the Grasse countryside",
  },
];

// Per-card parallax ranges — the centre card drifts furthest
const PARALLAX = [14, 36, 14];

export default function Journal() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: gentle fades, no parallax
      if (prefersReducedMotion()) {
        gsap.from(".j-card", {
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: ".j-grid", start: "top 84%", once: true },
        });
        return;
      }

      // Staggered card entrances
      gsap.from(".j-card", {
        y: 70,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".j-grid", start: "top 82%", once: true },
      });

      // Counter-parallax — cards drift at different speeds while scrolling
      gsap.utils.toArray<HTMLElement>(".j-par").forEach((el, i) => {
        const m = PARALLAX[i] ?? 14;
        gsap.fromTo(
          el,
          { y: m },
          {
            y: -m,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="journal" className="relative py-28 lg:py-44">
      <div className="container-lumea">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow">The Journal</p>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-light leading-[1.02] text-cocoa">
              Notes from <em className="italic text-clay">the atelier.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-taupe">
            Essays and harvest notes, written between batches. Unhurried, like
            everything we make.
          </p>
        </Reveal>

        <div className="j-grid mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-20">
          {ARTICLES.map((article) => (
            <div key={article.title} className="j-par">
              <a
                href="#journal"
                onClick={(e) => e.preventDefault()}
                className="j-card group block"
                aria-label={`Read: ${article.title}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-linen">
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/85 px-3.5 py-1.5 text-[9px] tracking-[0.25em] text-cocoa backdrop-blur-sm">
                    {article.tag}
                  </span>
                  <span className="absolute bottom-4 right-4 grid size-11 translate-y-3 place-items-center rounded-full bg-cream text-cocoa opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-cocoa">
                    {article.title}
                  </h3>
                  <p className="shrink-0 text-[9px] uppercase tracking-[0.25em] text-taupe">
                    {article.time}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-taupe">
                  {article.excerpt}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
