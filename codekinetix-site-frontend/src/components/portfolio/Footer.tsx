"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SOCIALS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/codekinetix/" },
  { label: "FACEBOOK", href: "https://www.facebook.com/codekinetix/" },
];

const SECTIONS = [
  { label: "WORKS", href: "/works" },
  { label: "ABOUT", href: "/about" },
  { label: "LAB", href: "/lab" },
  { label: "CAREER", href: "/career" },
  { label: "CONTACT", href: "/contact" },
];

export default function Footer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.set(".ft-reveal", { opacity: 0, y: 30 });
      gsap.set(".ft-word", { yPercent: 110 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          scroller: scrollerEl,
          start: "top 92%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(".ft-reveal", { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }).to(
        ".ft-word",
        { yPercent: 0, duration: 0.9, ease: "power4.out" },
        "-=0.4"
      );

      /* giant wordmark drifts sideways as the footer scrolls past */
      gsap.fromTo(
        ".ft-word",
        { xPercent: 4 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            scroller: scrollerEl,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);

    // Refresh triggers once layout stabilizes
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <footer
      id="contact"
      ref={rootRef}
      className="relative bg-void text-bone border-t border-bone/10"
    >
      {/* Volt crown bar */}
      <div className="h-[3px] w-full bg-volt" aria-hidden="true" />
      <div className="bg-grid-dark absolute inset-0 pointer-events-none mobile-hide-overlay" aria-hidden="true" />

      <div className="relative z-10 px-4 sm:px-8 pt-16 sm:pt-24 pb-36">
        <p className="ft-reveal font-mono text-[10px] tracking-[0.35em] text-volt uppercase mb-4">
          07 — DIRECT CONTACT // CODEKINETIX
        </p>

        <div className="ft-reveal mb-8">
          <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] leading-[0.92] text-bone text-[8vw] sm:text-[5vw] max-w-4xl">
            YOUR NEXT WEBSITE STARTS HERE.
          </h2>
        </div>

        <div className="ft-reveal flex flex-wrap items-baseline gap-4 mb-4">
          <a
            href="mailto:codekinetixstudio@gmail.com"
            className="group inline-block font-extrabold type-xwide uppercase tracking-[-0.02em] leading-[1.08] break-all text-bone hover:text-volt transition-colors duration-400 text-[6vw] sm:text-[3.2vw]"
          >
            codekinetixstudio@gmail.com
            <span className="inline-block ml-3 text-volt group-hover:rotate-45 transition-transform duration-400 align-middle text-[0.5em]">
              ↗
            </span>
          </a>
        </div>

        <div className="ft-reveal flex flex-wrap items-center gap-4 mb-12">
          <p className="font-serif italic text-bone/70 text-xl sm:text-2xl">
            Let&apos;s build something people remember.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-volt text-void font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] px-6 py-3 rounded-full hover:bg-bone transition-colors uppercase [-webkit-tap-highlight-color:transparent]"
          >
            START A PROJECT ↗
          </Link>
        </div>

        <div className="ft-reveal grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-bone/10 pt-10 max-w-4xl">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">SECTIONS</p>
            <ul className="space-y-2 font-mono text-xs">
              {SECTIONS.slice(0, 3).map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-bone/70 hover:text-volt transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">EXPLORE</p>
            <ul className="space-y-2 font-mono text-xs">
              {SECTIONS.slice(3).map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-bone/70 hover:text-volt transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">SOCIALS</p>
            <ul className="space-y-2 font-mono text-xs">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-bone/70 hover:text-volt transition-colors"
                  >
                    {s.label}
                    <span className="inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">AVAILABILITY</p>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-volt border border-volt/40 px-3 py-1.5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-volt opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-volt" />
              </span>
              AVAILABLE NOW
            </span>
          </div>
        </div>

        <div className="ft-reveal mt-16 overflow-hidden">
          <p
            className="ft-word font-extrabold type-xwide uppercase tracking-[-0.02em] leading-none text-[12vw] sm:text-[9vw] opacity-40 text-center select-none"
            aria-hidden="true"
          >
            {"CodeKinetix".split("").map((c, i) => (
              <span
                key={i}
                className="inline-block text-stroke-bone hover:text-volt hover:-translate-y-[0.07em] transition-[color,translate] duration-300 ease-out cursor-default"
              >
                {c}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-8 font-mono text-[10px] text-bone/40 tracking-wide">
          <span>© {new Date().getFullYear()} CODEKINETIX® — DIGITAL EXPERIENCE STUDIO</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
