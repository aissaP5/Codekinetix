"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Motion preference. "Reduce motion" users get the lite experience
 * (gentle fades, no movement). Append ?motion=full to force full
 * choreography, or ?motion=lite to force lite, overriding the OS setting.
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  try {
    const override = new URLSearchParams(window.location.search).get("motion");
    if (override === "full") return false;
    if (override === "lite") return true;
  } catch {
    /* ignore malformed URLs */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Elegant anchor navigation
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.start();
      lenis.scrollTo(target as HTMLElement, {
        offset: -72,
        duration: 1.5,
        force: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    };
    document.addEventListener("click", onClick);

    // Scroll progress hairline
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.4,
        },
      });
    });

    return () => {
      ctx.revert();
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left scale-x-0 bg-rose"
      />
      {children}
    </>
  );
}
