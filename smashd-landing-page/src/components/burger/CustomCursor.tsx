"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Dot + trailing ring cursor. Ring grows and shows a label over [data-cursor] targets. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: 0, yPercent: 0, x: -100, y: -100 });

    const dotX = gsap.quickSetter(dot, "x", "px");
    const dotY = gsap.quickSetter(dot, "y", "px");
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX - 4);
      dotY(e.clientY - 4);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const label = ring.querySelector<HTMLElement>(".cursor-label");

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (target) {
        ring.classList.add("is-active");
        if (label) label.textContent = target.dataset.cursor ?? "OPEN";
      }
    };
    const out = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (target) ring.classList.remove("is-active");
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-label font-sans" />
      </div>
    </>
  );
}
