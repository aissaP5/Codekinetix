"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import Magnetic from "./magnetic";
import { getLenis, prefersReducedMotion } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    title: "Shop",
    links: ["La Collection", "The Discovery Set", "Gift Cards"],
  },
  {
    title: "Maison",
    links: ["Our Philosophy", "The Atelier", "Journal"],
  },
  {
    title: "Care",
    links: ["Shipping & Returns", "Contact", "FAQ"],
  },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: fades only, wordmark stays put
      if (prefersReducedMotion()) {
        gsap.from(".footer-col", {
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
        });
        return;
      }

      // Columns rise softly
      gsap.from(".footer-col", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
      });

      // The giant wordmark lifts as the footer settles
      gsap.fromTo(
        ".footer-word",
        { yPercent: 62 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-word-wrap",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={rootRef} className="mt-auto bg-cocoa text-cream">
      <div className="container-lumea pt-20 lg:pt-28">
        <div className="grid gap-14 pb-20 md:grid-cols-12 lg:pb-24">
          <div className="footer-col md:col-span-5">
            <p className="font-display text-2xl tracking-[0.42em]">LUMÉA</p>
            <p className="mt-7 max-w-xs text-sm leading-7 text-cream/60">
              Cold-pressed botanical skincare, composed in small batches in
              Grasse, France. The quiet art of radiance.
            </p>
            <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-cream/40">
              Est. 2025 — Grasse · Paris · Tokyo
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="footer-col md:col-span-2"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] text-cream/40">
                {col.title}
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="nav-link text-sm text-cream/75 transition-colors hover:text-cream"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-col flex items-start md:col-span-1 md:justify-end">
            <Magnetic strength={0.4}>
              <button
                type="button"
                aria-label="Back to top"
                onClick={() => {
                  const lenis = getLenis();
                  if (lenis) {
                    lenis.start();
                    lenis.scrollTo(0, { duration: 1.8, force: true });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group grid size-12 place-items-center rounded-full border border-cream/25 transition-colors duration-500 hover:bg-cream hover:text-cocoa"
              >
                <ArrowUp
                  className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Giant rising wordmark */}
        <div className="footer-word-wrap overflow-hidden border-t border-cream/10 pt-6">
          <p
            aria-hidden
            className="footer-word select-none text-center font-display text-[22vw] font-light leading-[0.82] tracking-[0.04em]"
          >
            LUMÉA
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-8 text-[9px] uppercase tracking-[0.28em] text-cream/45 sm:flex-row">
          <p>© 2025 Luméa — Maison de Skincare</p>
          <p>Crafted slowly, like everything we make</p>
        </div>
      </div>
    </footer>
  );
}
