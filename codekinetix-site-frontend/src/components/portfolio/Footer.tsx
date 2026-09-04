"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SOCIALS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/codekinetix/" },
  { label: "FACEBOOK", href: "https://www.facebook.com/codekinetix/" },
];

export default function Footer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordSlideRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const wordSlide = wordSlideRef.current;
    if (!root) return;
    const scrollerEl = root.closest("main") ?? undefined;

    const reveals = Array.from(root.querySelectorAll<HTMLElement>(".ft-reveal"));
    const wordEl = root.querySelector<HTMLElement>(".ft-word");

    const ctx = gsap.context(() => {
      if (!hasRevealedRef.current) {
        if (reveals.length) gsap.set(reveals, { opacity: 0, y: 25 });
        if (wordSlide) gsap.set(wordSlide, { yPercent: 105 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller: scrollerEl,
            start: "top 95%",
            once: true,
            onEnter: () => {
              hasRevealedRef.current = true;
            },
          },
        });

        if (reveals.length) {
          tl.to(reveals, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" });
        }
        if (wordSlide) {
          tl.to(
            wordSlide,
            {
              yPercent: 0,
              duration: 0.85,
              ease: "power4.out",
              onComplete: () => { hasRevealedRef.current = true; },
            },
            reveals.length ? "-=0.35" : 0
          );
        }
      } else {
        // Already revealed — snap to final state without re-animating
        if (reveals.length) gsap.set(reveals, { opacity: 1, y: 0 });
        if (wordSlide) gsap.set(wordSlide, { yPercent: 0 });
      }

      /* Giant wordmark lateral parallax drift ONLY on desktop, never on mobile */
      const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      if (wordEl) {
        if (!isMobile) {
          gsap.fromTo(
            wordEl,
            { xPercent: 2 },
            {
              xPercent: -2,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                scroller: scrollerEl,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        } else {
          gsap.set(wordEl, { xPercent: 0 });
        }
      }
    }, root);

    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  const scrollToTop = () => {
    const scroller = rootRef.current?.closest("main");
    if (scroller && scroller.scrollHeight > scroller.clientHeight) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      ref={rootRef}
      className="relative bg-void text-bone border-t border-bone/10 overflow-hidden"
    >
      {/* Volt crown bar */}
      <div className="h-[3px] w-full bg-volt" aria-hidden="true" />
      <div className="bg-grid-dark absolute inset-0 pointer-events-none mobile-hide-overlay" aria-hidden="true" />

      {/* Left-aligned container with safe bottom clearance for floating nav */}
      <div className="relative z-10 px-4 sm:px-8 pt-16 sm:pt-24 pb-24 sm:pb-28 text-left">

        <div className="ft-reveal mb-8">
          <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] leading-[0.92] text-bone text-[8vw] sm:text-[5vw] max-w-4xl text-left">
            YOUR NEXT WEBSITE STARTS HERE.
          </h2>
        </div>

        <div className="ft-reveal flex flex-wrap items-baseline gap-4 mb-4 text-left">
          <a
            href="mailto:codekinetixstudio@gmail.com"
            className="group inline-block font-extrabold type-xwide uppercase tracking-[-0.02em] leading-[1.08] break-words sm:break-normal text-bone hover:text-volt transition-colors duration-400 text-[clamp(20px,5.2vw,46px)]"
          >
            codekinetixstudio@gmail.com
            <span className="inline-block ml-3 text-volt group-hover:rotate-45 transition-transform duration-400 align-middle text-[0.5em]">
              ↗
            </span>
          </a>
        </div>

        <div className="ft-reveal flex flex-wrap items-center gap-4 mb-12 text-left">
          <p className="font-serif italic text-bone/70 text-xl sm:text-2xl">
            Let&apos;s build something people remember.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-block bg-volt text-void font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] px-6 py-3 rounded-full hover:bg-bone transition-colors uppercase [-webkit-tap-highlight-color:transparent]"
            >
              START A PROJECT ↗
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 border border-bone/20 hover:border-volt bg-panel/30 hover:bg-panel px-5 py-3 rounded-full font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-bone/75 hover:text-volt uppercase transition-all duration-300 cursor-pointer [-webkit-tap-highlight-color:transparent]"
              aria-label="Scroll back to top"
            >
              <span>BACK TO TOP</span>
              <span className="inline-block group-hover:-translate-y-0.5 transition-transform duration-300 text-volt font-bold">
                ↑
              </span>
            </button>
          </div>
        </div>

        {/* Left-aligned directory (NO duplicate email, NO navigation links) */}
        <div className="ft-reveal grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-bone/10 pt-10 max-w-3xl text-left">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">CONNECT</p>
            <ul className="space-y-2.5 font-mono text-xs">
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
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">LOCATION</p>
            <div className="space-y-2 font-mono text-xs text-bone/60">
              <p>WORLDWIDE // REMOTE</p>
              <p className="text-[11px] text-bone/40 uppercase">DIRECT COMM — NO MIDDLEMEN</p>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone/40 uppercase mb-4">AVAILABILITY</p>
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-volt border border-volt/40 px-3 py-1.5 bg-volt/5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-volt opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-volt" />
                </span>
                AVAILABLE NOW
              </span>
              <p className="font-mono text-[10px] text-bone/50 tracking-wider uppercase">
                COMMISSIONS OPEN
              </p>
            </div>
          </div>
        </div>

        {/* Massive watermark brand wordmark — perfectly centered on mobile with safe clearance */}
        <div className="ft-reveal mt-16 overflow-hidden w-full">
          <div ref={wordSlideRef} className="ft-word-slide will-change-transform w-full flex justify-center items-center px-4">
            <p
              className="ft-word font-extrabold type-xwide uppercase tracking-[-0.01em] leading-none text-[clamp(22px,7.8vw,44px)] sm:text-[clamp(44px,8.8vw,120px)] opacity-35 text-center select-none w-full"
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
        </div>

        {/* Bottom meta row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-bone/10 font-mono text-[10px] text-bone/40 tracking-wide text-left">
          <span>CODEKINETIX® — DIGITAL EXPERIENCE STUDIO</span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/privacy"
              className="text-bone/50 hover:text-volt transition-colors uppercase tracking-widest"
            >
              PRIVACY POLICY
            </Link>
            <span className="text-bone/20" aria-hidden="true">•</span>
            <Link
              href="/terms"
              className="text-bone/50 hover:text-volt transition-colors uppercase tracking-widest"
            >
              TERMS OF SERVICE
            </Link>
          </div>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
