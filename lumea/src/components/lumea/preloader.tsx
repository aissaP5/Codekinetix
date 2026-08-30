"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getLenis, prefersReducedMotion } from "./smooth-scroll";

const LETTERS = ["L", "U", "M", "É", "A"];

interface PreloaderProps {
  /** Fired the moment the curtain starts lifting, so the hero can begin. */
  onReveal: () => void;
}

export default function Preloader({ onReveal }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();

    const finish = () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };

    // Lite mode: no curtain choreography — a quick, elegant fade instead
    if (prefersReducedMotion()) {
      gsap.set(".pre-line", { scaleX: 0 });
      const tl = gsap.timeline({
        onComplete: () => gsap.set(root, { display: "none" }),
      });
      tl.fromTo(
        [".pre-letter", ".pre-caption"],
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.04 }
      )
        .add(() => onReveal(), 0.9)
        .to(root, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, 1.0)
        .add(finish, 1.4);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => gsap.set(root, { display: "none" }),
      });

      tl.fromTo(
        ".pre-letter",
        { yPercent: 120 },
        { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.06 },
        0.2
      )
        .fromTo(
          ".pre-caption",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          1.0
        )
        .fromTo(
          ".pre-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
          0.45
        )
        // ——— exit ———
        .to(
          ".pre-letter",
          { yPercent: -130, duration: 0.6, ease: "power3.in", stagger: 0.04 },
          2.1
        )
        .to([".pre-caption", ".pre-line"], { opacity: 0, duration: 0.35 }, 2.1)
        // Hero begins while the curtain is still lifting — a continuous handoff
        .add(() => onReveal(), 2.5)
        .to(
          ".pre-panel-front",
          { yPercent: -100, duration: 1.15, ease: "power4.inOut" },
          2.58
        )
        .to(
          ".pre-panel-back",
          { yPercent: -100, duration: 1.15, ease: "power4.inOut" },
          2.72
        )
        .add(finish, 3.42);
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]" aria-hidden>
      <div className="pre-panel-back absolute inset-0 bg-blush" />
      <div className="pre-panel-front absolute inset-0 grid place-items-center bg-cream">
        <div className="flex flex-col items-center">
          <p className="flex overflow-hidden font-display text-[16vw] leading-none tracking-[0.08em] text-cocoa sm:text-[10vw] lg:text-[7vw]">
            {LETTERS.map((letter, i) => (
              <span key={i} className="pre-letter inline-block will-change-transform">
                {letter}
              </span>
            ))}
          </p>
          <div className="pre-line mt-6 h-px w-40 origin-left bg-cocoa/25" />
          <p className="pre-caption mt-5 text-[10px] tracking-[0.45em] text-taupe">
            MAISON DE SKINCARE
          </p>
        </div>
      </div>
    </div>
  );
}
