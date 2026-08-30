"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Dot + trailing ring cursor, inverts over content via blend-difference. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("lumea-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let visible = false;
    const move = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const hoverTargets = "a, button, input, [data-cursor]";
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(hoverTargets);
      if (t) {
        gsap.to(ring, {
          scale: 1.9,
          backgroundColor: "rgba(232,203,194,0.32)",
          duration: 0.4,
          ease: "power3",
        });
        gsap.to(dot, { scale: 0.45, duration: 0.4, ease: "power3" });
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(hoverTargets);
      if (t) {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "rgba(232,203,194,0)",
          duration: 0.4,
          ease: "power3",
        });
        gsap.to(dot, { scale: 1, duration: 0.4, ease: "power3" });
      }
    };

    const leaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
      visible = false;
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", leaveWindow);

    return () => {
      document.documentElement.classList.remove("lumea-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", leaveWindow);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[97] size-[7px] rounded-full bg-white mix-blend-difference opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] size-9 rounded-full border border-white mix-blend-difference opacity-0"
      />
    </>
  );
}
