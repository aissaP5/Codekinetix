"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export type CursorMode = "default" | "view" | "open" | "drag" | "explore" | "hover";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    // Only enable on desktop pointer devices with fine cursor
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!media.matches) return;

    // Check reduced motion preference
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    setEnabled(true);
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3" });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      // Detect cursor context from hovered target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
      const isInteractive = target.closest("a, button, input, textarea, select, [role='button']");

      let nextMode: CursorMode = "default";
      let label = "";

      if (cursorTarget) {
        const val = cursorTarget.getAttribute("data-cursor") as CursorMode;
        nextMode = val || "hover";
        if (val === "view") label = "VIEW ↗";
        else if (val === "open") label = "OPEN ↗";
        else if (val === "drag") label = "DRAG";
        else if (val === "explore") label = "EXPLORE ↗";
      } else if (isInteractive) {
        nextMode = "hover";
      }

      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        if (textRef.current) textRef.current.textContent = label;

        if (nextMode === "default") {
          gsap.to(cursor, {
            width: 14,
            height: 14,
            backgroundColor: "rgba(242, 241, 234, 0.9)",
            borderColor: "transparent",
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        } else if (nextMode === "hover") {
          gsap.to(cursor, {
            width: 38,
            height: 38,
            backgroundColor: "rgba(58, 111, 255, 0.2)",
            borderColor: "#3a6fff",
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        } else {
          gsap.to(cursor, {
            width: 84,
            height: 84,
            backgroundColor: "#3a6fff",
            borderColor: "#f2f1ea",
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.5)",
          });
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent backdrop-blur-[1px] opacity-0 flex items-center justify-center transition-[background-color,border-color] duration-200 select-none overflow-hidden will-change-transform"
      style={{ width: 14, height: 14, backgroundColor: "rgba(242, 241, 234, 0.9)" }}
      aria-hidden="true"
    >
      <span
        ref={textRef}
        className="font-mono text-[9px] font-bold tracking-[0.15em] text-void text-center whitespace-nowrap leading-none"
      />
    </div>
  );
}
