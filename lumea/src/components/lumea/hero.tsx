"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowDown } from "lucide-react";
import Magnetic from "./magnetic";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  started: boolean;
}

export default function Hero({ started }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: opacity-only entrance — no movement, still alive
      if (prefersReducedMotion()) {
        gsap.set(
          [".hero-line", ".hero-eyebrow", ".hero-sub", ".hero-cta", ".hero-meta", ".hero-fig", ".hero-badge"],
          { opacity: 0 }
        );
        const tl = gsap.timeline({ paused: true });
        tl.to(".hero-fig", { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
          .to(".hero-eyebrow", { opacity: 1, duration: 0.5 }, 0.25)
          .to(".hero-line", { opacity: 1, duration: 0.6, stagger: 0.12 }, 0.35)
          .to(".hero-sub", { opacity: 1, duration: 0.5 }, 0.7)
          .to(".hero-cta", { opacity: 1, duration: 0.5 }, 0.85)
          .to(".hero-badge", { opacity: 1, duration: 0.5 }, 1.0)
          .to(".hero-meta", { opacity: 1, duration: 0.6 }, 1.1);
        tlRef.current = tl;
        return;
      }

      // Initial hidden states
      gsap.set(".hero-line", { yPercent: 115 });
      gsap.set(".hero-eyebrow", { opacity: 0, y: 14 });
      gsap.set(".hero-sub", { opacity: 0, y: 20 });
      gsap.set(".hero-cta", { opacity: 0, y: 24 });
      gsap.set(".hero-meta", { opacity: 0 });
      gsap.set(".hero-fig", { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".hero-img", { scale: 1.35 });
      gsap.set(".hero-badge", { scale: 0, rotate: -30 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.to(".hero-fig", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.7,
        ease: "power4.inOut",
      })
        .to(".hero-img", { scale: 1, duration: 2.2, ease: "expo.out" }, 0.1)
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1 }, 0.3)
        .to(".hero-line", { yPercent: 0, duration: 1.35, stagger: 0.14 }, 0.42)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 1 }, 1.05)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 1 }, 1.2)
        .to(
          ".hero-badge",
          { scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.6)" },
          1.35
        )
        .to(".hero-meta", { opacity: 1, duration: 1.1 }, 1.55);
      tlRef.current = tl;

      // Parallax on the hero image
      gsap.fromTo(
        ".hero-img",
        { yPercent: -6 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Watermark drifts slower than the page
      gsap.fromTo(
        ".hero-watermark",
        { yPercent: 34 },
        {
          yPercent: -34,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Rotating badge
      gsap.to(".hero-badge-ring", {
        rotate: 360,
        duration: 18,
        ease: "none",
        repeat: -1,
      });

      // Gentle float beneath the rotation
      gsap.to(".hero-badge-float", {
        y: -9,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll hint pulse
      gsap.to(".hero-scroll-dot", {
        y: 26,
        opacity: 0,
        duration: 1.4,
        ease: "power2.in",
        repeat: -1,
        repeatDelay: 0.4,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (started) tlRef.current?.play();
  }, [started]);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-24 pt-32 lg:pt-36"
    >
      {/* Faint oversized watermark */}
      <span
        aria-hidden
        className="hero-watermark hero-meta pointer-events-none absolute -right-8 top-24 hidden select-none font-display text-[11rem] italic leading-none text-sand/50 will-change-transform xl:block"
      >
        É
      </span>

      <div className="container-lumea relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-6">
          {/* Copy */}
          <div className="relative z-20 lg:col-span-7">
            <p className="hero-eyebrow eyebrow">
              Maison de Skincare — Est. 2025
            </p>
            <h1 className="mt-7 font-display text-[clamp(3.4rem,10.5vw,9.5rem)] font-light leading-[0.98] tracking-[-0.01em] text-cocoa">
              <span className="mask-line">
                <span className="hero-line block will-change-transform">
                  The quiet art
                </span>
              </span>
              <span className="mask-line">
                <span className="hero-line block will-change-transform">
                  of <em className="font-normal italic text-clay">radiance</em>
                </span>
              </span>
            </h1>
            <p className="hero-sub mt-9 max-w-md text-[15px] leading-8 text-taupe">
              Cold-pressed botanical formulas, composed in numbered batches in
              Grasse. Skincare that listens before it acts — and never says
              more than your skin needs.
            </p>
            <div className="hero-cta mt-11 flex flex-wrap items-center gap-7">
              <Magnetic>
                <a
                  href="#collection"
                  className="group inline-flex items-center gap-3 rounded-full bg-cocoa px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-cream transition-colors duration-500 hover:bg-espresso"
                >
                  Discover the collection
                  <ArrowRight
                    className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </a>
              </Magnetic>
              <a
                href="#ritual"
                className="nav-link text-[10px] uppercase tracking-[0.3em] text-cocoa/70 hover:text-cocoa"
              >
                The ritual
              </a>
            </div>
            <p className="hero-eyebrow mt-12 hidden items-center gap-3 text-taupe/80 lg:flex">
              <span className="inline-block size-1 rounded-full bg-clay" />
              Rated 4.9 by 2,300+ devotees
            </p>
          </div>

          {/* Image */}
          <div className="relative z-10 lg:col-span-5">
            <figure className="hero-fig relative aspect-[3/4] w-full overflow-hidden rounded-[6px] will-change-[clip-path]">
              <div className="hero-img absolute inset-0 will-change-transform">
                <Image
                  src="/images/hero.png"
                  alt="LUMÉA radiance serum bottle on a travertine pedestal with draped silk"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>

            {/* Rotating badge — floats gently as it turns */}
            <div className="hero-badge-float absolute -bottom-8 -left-6 will-change-transform lg:-left-14">
              <div className="hero-badge grid size-28 place-items-center rounded-full bg-cream shadow-[0_18px_40px_-18px_rgba(45,36,27,0.4)] lg:size-36">
                <svg
                  viewBox="0 0 100 100"
                  className="hero-badge-ring absolute inset-0 size-full"
                  aria-hidden
                >
                  <defs>
                    <path
                      id="badge-circle"
                      d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text className="fill-cocoa text-[8.2px] uppercase tracking-[0.24em]">
                    <textPath href="#badge-circle">
                      Luméa · Maison de Skincare · Est. 2025 ·
                    </textPath>
                  </text>
                </svg>
                <ArrowDown className="size-4 text-clay" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="hero-meta mt-20 flex items-end justify-between border-t border-cocoa/10 pt-6 lg:mt-24">
          <p className="text-[9px] uppercase tracking-[0.3em] text-taupe">
            N°01 — Éclat Radiance Serum
          </p>
          <div className="hidden flex-col items-center gap-3 sm:flex">
            <span className="text-[9px] uppercase tracking-[0.35em] text-taupe">
              Scroll
            </span>
            <span className="relative block h-12 w-px overflow-hidden bg-cocoa/15">
              <span className="hero-scroll-dot absolute left-0 top-0 block h-3 w-px bg-clay" />
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-taupe">
            Grasse, France — 43.66°N
          </p>
        </div>
      </div>
    </section>
  );
}
