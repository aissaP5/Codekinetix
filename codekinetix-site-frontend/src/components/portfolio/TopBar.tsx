"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";

/**
 * Minimal studio header — wordmark, one-line positioning, contact action.
 * No clock, no location, no branch indicators. The CTA is magnetic on
 * pointer devices: it drifts toward the cursor and snaps home on leave.
 */
export default function TopBar() {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let base: DOMRect | null = null;
    const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });

    const onEnter = () => {
      base = btn.getBoundingClientRect(); // unmoved rect — no feedback loop
    };
    const onMove = (e: PointerEvent) => {
      if (!base) return;
      xTo((e.clientX - (base.left + base.width / 2)) * 0.35);
      yTo((e.clientY - (base.top + base.height / 2)) * 0.55);
    };
    const onLeave = () => {
      base = null;
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <header className="relative z-40 flex items-center justify-between gap-3 px-4 sm:px-8 py-3.5 sm:py-4 border-b border-bone/10 bg-void">
      {/* wordmark */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-2.5 shrink-0"
        aria-label="CodeKinetix home"
      >
        <span className="w-2.5 h-2.5 bg-volt rotate-45 shrink-0" aria-hidden="true" />
        <span className="font-extrabold type-wide uppercase tracking-tight text-bone text-[15px] sm:text-[17px] leading-none">
          CodeKinetix<sup className="text-volt text-[9px] align-super">®</sup>
        </span>
      </a>

      {/* one-line positioning */}
      <p className="hidden lg:block font-mono text-[10px] tracking-[0.22em] text-ash text-center">
        INDEPENDENT WEB STUDIO — SITES · SHOPS · WEB APPS
      </p>

      {/* contact action — magnetic button opening direct email */}
      <a
        ref={ctaRef}
        href="mailto:codekinetixstudio@gmail.com"
        className="group flex items-center gap-2 bg-volt text-void font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] px-4 sm:px-5 py-2.5 hover:bg-bone transition-colors duration-300 [-webkit-tap-highlight-color:transparent]"
        aria-label="Send an email to CodeKinetix"
      >
        LET&apos;S TALK
        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
          ↗
        </span>
      </a>
    </header>
  );
}
