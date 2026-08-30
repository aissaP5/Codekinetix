"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Magnetic from "./magnetic";
import Reveal from "./reveal";
import { prefersReducedMotion } from "./smooth-scroll";

const QUOTES = [
  {
    text: "The rare serum that respects both your skin and your intelligence.",
    source: "Vogue",
  },
  {
    text: "LUMÉA has quietly redefined what French skincare can be.",
    source: "Elle",
  },
  {
    text: "A masterclass in restraint — every single ingredient earns its place.",
    source: "Harper's Bazaar",
  },
  {
    text: "Éclat is the closest thing to dawn in a bottle.",
    source: "Allure",
  },
];

const ROTATION_MS = 6500;

export default function Press() {
  const rootRef = useRef<HTMLElement>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prevRef = useRef(0);
  const pausedRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // The active dot's fill IS the autoplay clock — runs in lite mode too (opacity crossfades)
  useEffect(() => {
    const fill = fillRefs.current[index];
    if (!fill) return;
    const tween = gsap.fromTo(
      fill,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: ROTATION_MS / 1000,
        ease: "none",
        onComplete: () => setIndex((i) => (i + 1) % QUOTES.length),
      }
    );
    if (pausedRef.current) tween.pause();
    tweenRef.current = tween;
    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, [index]);

  // Hover pauses the clock without losing progress
  useEffect(() => {
    pausedRef.current = paused;
    const t = tweenRef.current;
    if (!t) return;
    if (paused) t.pause();
    else t.play();
  }, [paused]);

  // Crossfade between quotes
  useEffect(() => {
    const quotes = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(".press-quote") ?? []
    );
    if (quotes.length === 0) return;
    const prev = prevRef.current;
    prevRef.current = index;
    if (prev === index) return;

    if (prefersReducedMotion()) {
      // Lite mode: opacity-only crossfade
      gsap.to(quotes[prev], { opacity: 0, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(
        quotes[index],
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
      return;
    }
    gsap.to(quotes[prev], {
      opacity: 0,
      y: -28,
      duration: 0.5,
      ease: "power2.in",
    });
    gsap.fromTo(
      quotes[index],
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.28, ease: "power3.out" }
    );
  }, [index]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);

  return (
    <section ref={rootRef} id="press" className="relative bg-ivory py-28 lg:py-40">
      <div className="container-lumea">
        <Reveal className="flex items-center justify-between gap-6">
          <p className="eyebrow">In the press</p>
          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-taupe/70 sm:block">
            What they whisper
          </p>
        </Reveal>

        <div
          className="relative mt-14 min-h-[320px] sm:min-h-[250px] lg:min-h-[220px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-14 -left-1 select-none font-display text-[9rem] italic leading-none text-sand/70 lg:-top-20 lg:text-[13rem]"
          >
            &ldquo;
          </span>

          {QUOTES.map((q, i) => (
            <figure
              key={q.source}
              className="press-quote absolute inset-x-0 top-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden={i !== index}
            >
              <blockquote className="relative max-w-4xl font-display text-[clamp(1.7rem,4vw,3.4rem)] font-light italic leading-[1.16] text-cocoa">
                {q.text}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-taupe">
                <span className="inline-block h-px w-10 bg-clay" />
                {q.source}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-between border-t border-cocoa/10 pt-7">
          <div className="flex items-center gap-3" role="tablist" aria-label="Press quotes">
            {QUOTES.map((q, i) => (
              <button
                key={q.source}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show quote from ${q.source}`}
                aria-selected={i === index}
                role="tab"
                className="relative h-[3px] w-10 overflow-hidden bg-cocoa/15"
              >
                <span
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left bg-cocoa"
                  style={{ transform: "scaleX(0)" }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous quote"
                className="grid size-12 place-items-center rounded-full border border-cocoa/20 text-cocoa transition-colors duration-500 hover:bg-cocoa hover:text-cream"
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
            </Magnetic>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next quote"
                className="grid size-12 place-items-center rounded-full border border-cocoa/20 text-cocoa transition-colors duration-500 hover:bg-cocoa hover:text-cream"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
