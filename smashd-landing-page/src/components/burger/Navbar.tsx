"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { label: "Anatomy", href: "#anatomy" },
  { label: "The Stack", href: "#stack" },
  { label: "Menu", href: "#menu" },
];

export function Navbar({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!visible) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { y: -26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: "power3.out", delay: 0.1 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [visible]);

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(href, { offset: 0, duration: 1.6 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={rootRef}
      className="absolute top-0 inset-x-0 z-[30] text-foreground py-5"
    >
      <nav className="flex items-center justify-between px-5 md:px-10 max-w-7xl mx-auto">
        <a
          href="#top"
          onClick={scrollTo("#top")}
          className="nav-item font-display text-xl md:text-2xl tracking-wider text-foreground hover:opacity-90 transition-opacity"
          data-cursor="TOP"
        >
          SMASH&apos;D<span className="text-ember">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <li key={l.href} className="nav-item">
              <a
                href={l.href}
                onClick={scrollTo(l.href)}
                className="font-sans text-[13px] tracking-[0.22em] uppercase text-foreground/80 hover:text-ember transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-item">
          <Magnetic
            href="#menu"
            onClick={scrollTo("#menu")}
            data-cursor="HUNGRY?"
            className="font-sans text-[12px] font-bold tracking-[0.22em] uppercase border border-foreground/50 rounded-full px-6 py-2.5 text-foreground hover:bg-foreground hover:text-ink transition-all duration-300"
          >
            Order Now
          </Magnetic>
        </div>
      </nav>
    </header>
  );
}
