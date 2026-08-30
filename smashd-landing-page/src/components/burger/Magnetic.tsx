"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: ReactNode;
  /** render as anchor or button */
  as?: "a" | "button";
  strength?: number;
  innerStrength?: number;
  className?: string;
  /** optional external ref to the rendered element */
  elementRef?: React.RefObject<HTMLElement | null>;
  [key: string]: unknown;
}

/** Element gravitates toward the cursor, springs back on leave. */
export function Magnetic({
  children,
  as = "a",
  strength = 0.35,
  innerStrength = 0.5,
  className = "",
  elementRef,
  ...rest
}: MagneticProps) {
  const localRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;
    if (elementRef) elementRef.current = node;
  };

  useEffect(() => {
    const el = localRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const ixTo = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" });
    const iyTo = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
      ixTo(relX * strength * innerStrength);
      iyTo(relY * strength * innerStrength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      ixTo(0);
      iyTo(0);
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength, innerStrength]);

  if (as === "button") {
    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        type="button"
        className={`inline-block cursor-pointer ${className}`}
        {...rest}
      >
        <span ref={innerRef} className="inline-block">
          {children}
        </span>
      </button>
    );
  }

  return (
    <a
      ref={setRefs as React.Ref<HTMLAnchorElement>}
      className={`inline-block ${className}`}
      {...rest}
    >
      <span ref={innerRef} className="inline-block">
        {children}
      </span>
    </a>
  );
}
