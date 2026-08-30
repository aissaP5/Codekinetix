"use client";

import { useEffect, useState } from "react";
import { ToothGlyph } from "./bits";

const PLATES = [
  { n: "01", id: "top", label: "THE HOUSE" },
  { n: "02", id: "tariff", label: "THE TARIFF" },
  { n: "03", id: "group", label: "THE GROUP" },
  { n: "04", id: "book", label: "THE APPOINTMENT" },
];

export default function Rail() {
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

        let current = PLATES[0].id;
        for (const p of PLATES) {
          const el = document.getElementById(p.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) {
            current = p.id;
          }
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ——— desktop: the left index rail (no navbar) ——— */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-16 z-50 flex-col items-center justify-between border-r border-line bg-paper py-6"
        aria-label="Atlas index"
      >
        <a href="#top" aria-label="MARFIL — back to top" className="text-pine hover:text-verm transition-colors">
          <ToothGlyph className="w-6" />
        </a>

        <nav className="flex flex-col items-center gap-5">
          {PLATES.map((p) => {
            const on = active === p.id;
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                aria-label={p.label}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={`block h-2 w-2 border transition-all duration-300 ${
                    on
                      ? "bg-verm border-verm rotate-45"
                      : "border-ink/40 group-hover:border-verm group-hover:rotate-45"
                  }`}
                />
                <span
                  className={`mono text-[9px] tracking-[0.08em] transition-colors duration-300 ${
                    on ? "text-verm" : "text-ink/45 group-hover:text-ink"
                  }`}
                >
                  {p.n}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-3">
          <span className="w-px h-6 bg-line-strong" aria-hidden="true" />
          <span className="label text-ink/45 [writing-mode:vertical-rl]">
            EST.&nbsp;2009
          </span>
          <span
            className="pulse-dot block h-1.5 w-1.5 rounded-full bg-pine"
            title="Accepting patients"
          />
        </div>
      </aside>

      {/* ——— desktop: right-edge mm ruler with scroll indicator ——— */}
      <div
        className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="label text-ink/40">MM</span>
        <div className="relative h-64 w-3">
          <div className="ruler absolute inset-y-0 left-0 w-2 text-ink/30" />
          {/* vermilion probe, slides with scroll */}
          <div
            className="absolute -left-[3px] w-[9px] h-[14px] bg-verm transition-[top] duration-150 ease-out"
            style={{ top: `${progress * (100 - 5.2)}%` }}
          />
        </div>
        <span className="mono text-[9px] text-ink/55 tabnum">
          {String(Math.round(progress * 47)).padStart(2, "0")}
        </span>
      </div>

      {/* ——— mobile: slim top bar ——— */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between border-b border-line bg-paper/95 backdrop-blur px-4 h-12">
        <a href="#top" className="flex items-center gap-2">
          <ToothGlyph className="w-4 text-pine" />
          <span className="disp text-[12px] tracking-[0.04em]">
            MARFIL&thinsp;·&thinsp;47
          </span>
        </a>
        <nav className="flex items-center gap-3.5 label text-ink/60">
          <a href="#tariff" className="hover:text-verm transition-colors">
            TARIFF
          </a>
          <a href="#group" className="hover:text-verm transition-colors">
            GROUP
          </a>
          <a
            href="#book"
            className="bg-ink text-paper px-2.5 py-1.5 hover:bg-verm transition-colors"
          >
            BOOK
          </a>
        </nav>
      </header>
    </>
  );
}
