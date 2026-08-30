"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const QUOTE = "Skin remembers every kindness.";

export default function Editorial() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: word fades only, no parallax
      if (prefersReducedMotion()) {
        gsap.fromTo(
          ".quote-word",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.55,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: ".quote-block", start: "top 80%", once: true },
          }
        );
        gsap.from(".editorial-meta", {
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 60%", once: true },
        });
        return;
      }

      // Slow parallax drift on the portrait
      gsap.fromTo(
        ".editorial-img",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Quote words rise with a soft rotation
      gsap.fromTo(
        ".quote-word",
        { yPercent: 110, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".quote-block", start: "top 78%", once: true },
        }
      );

      gsap.from(".editorial-meta", {
        opacity: 0,
        y: 14,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 60%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="story"
      className="relative flex h-[92vh] min-h-[600px] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="editorial-img absolute -inset-y-[14%] inset-x-0">
          <Image
            src="/images/editorial.png"
            alt="A serene woman with luminous skin, wrapped in cream fabric in golden light"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-cocoa/10 to-cocoa/30" />

      <figure className="quote-block relative z-10 px-6 text-center">
        <blockquote className="mx-auto max-w-4xl font-display text-[clamp(2.3rem,5.4vw,4.8rem)] font-light italic leading-[1.12] text-cream">
          <span className="text-blush/90">&ldquo;</span>
          {QUOTE.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <span className="quote-word inline-block will-change-transform">
                {word}
                {"\u00A0"}
              </span>
            </span>
          ))}
          <span className="text-blush/90">&rdquo;</span>
        </blockquote>
        <figcaption className="mt-9 text-[10px] uppercase tracking-[0.35em] text-cream/75">
          Camille Moreau — Founder
        </figcaption>
      </figure>

      <p className="editorial-meta absolute left-6 top-8 text-[9px] uppercase tracking-[0.3em] text-cream/60 lg:left-12">
        The Maison — N°04
      </p>
      <p className="editorial-meta absolute bottom-8 right-6 text-[9px] uppercase tracking-[0.3em] text-cream/60 lg:right-12">
        Grasse, France
      </p>
    </section>
  );
}
