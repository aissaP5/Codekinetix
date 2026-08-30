"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Scroll-triggered fade-up reveal for section headers and copy blocks. */
export default function Reveal({ children, className, delay = 0, y = 44 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: fade without movement
      if (prefersReducedMotion()) {
        gsap.from(ref.current, {
          opacity: 0,
          duration: 0.7,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
        return;
      }
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 86%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
