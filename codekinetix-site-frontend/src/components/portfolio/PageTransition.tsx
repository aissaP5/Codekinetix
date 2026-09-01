"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix, type TabId } from "@/lib/store";
import { curtain } from "@/lib/curtain";

interface TabMeta {
  word: string;
  tag: string;
  sub: string;
  accent: string;
}

const TAB_CONFIG: Record<TabId, TabMeta> = {
  studio: {
    word: "STUDIO",
    tag: "01 // MASTER HUB",
    sub: "DIGITAL EXPERIENCE FLAGSHIP",
    accent: "#c6ff00",
  },
  works: {
    word: "WORKS",
    tag: "02 // PORTFOLIO",
    sub: "SELECTED CASE ARCHIVE",
    accent: "#f2f1ea",
  },
  about: {
    word: "ABOUT",
    tag: "03 // IDENTITY",
    sub: "CREATIVE ENGINEERING DNA",
    accent: "#c6ff00",
  },
  lab: {
    word: "LAB",
    tag: "04 // RESEARCH",
    sub: "BESPOKE INTERACTION SANDBOX",
    accent: "#3a6fff",
  },
  contact: {
    word: "CONTACT",
    tag: "05 // TRANSMISSION",
    sub: "COMMISSION A PROJECT",
    accent: "#ff4d00",
  },
};

const COLS = 7;

export default function PageTransition() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeTab = useKinetix((s) => s.activeTab);
  const contentTab = useKinetix((s) => s.contentTab);
  const setContentTab = useKinetix((s) => s.setContentTab);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const coveredRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || activeTab === contentTab) return;

    // Cancel any previous in-flight transition
    if (coveredRef.current) {
      curtain.uncover();
      coveredRef.current = false;
    }
    tlRef.current?.kill();

    const panel = root.querySelector<HTMLElement>(".pt-panel");
    const cols = gsap.utils.toArray<HTMLElement>(".pt-col", root);
    const letters = gsap.utils.toArray<HTMLElement>(".pt-letter", root);
    const meta = gsap.utils.toArray<HTMLElement>(".pt-meta", root);

    gsap.set(root, { visibility: "visible" });
    gsap.set(panel, { yPercent: 100, skewY: 0 });
    gsap.set(cols, { yPercent: 100, skewY: 0 });
    gsap.set(letters, {
      xPercent: 0,
      yPercent: -170,
      opacity: 0,
      rotation: () => gsap.utils.random(-25, 25),
    });
    gsap.set(meta, { opacity: 0 });

    curtain.cover();
    coveredRef.current = true;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(root, { visibility: "hidden" });
        gsap.set([panel, ...cols], { yPercent: 100 });
        tlRef.current = null;
        curtain.uncover();
        coveredRef.current = false;
      },
    });
    tlRef.current = tl;

    tl
      // 1 — Backdrop rises with a fluid skew
      .to(panel, { yPercent: 0, duration: 0.4 }, 0)
      .to(panel, { skewY: -2, duration: 0.14, ease: "sine.inOut" }, 0.05)
      .to(panel, { skewY: 0, duration: 0.18, ease: "sine.inOut" }, 0.25)
      // 2 — Columns cascade over backdrop
      .to(cols, { yPercent: 0, duration: 0.45, stagger: 0.04 }, 0.14)
      .to(cols, { skewY: -2, duration: 0.12, ease: "sine.inOut", stagger: 0.04 }, 0.2)
      .to(cols, { skewY: 0, duration: 0.16, ease: "sine.inOut", stagger: 0.04 }, 0.42)
      // 3 — Swap content underneath while completely covered
      .call(() => setContentTab(activeTab), [], 0.65)
      // 4 — Destination letters fall in with elastic bounce
      .to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: "back.out(1.8)",
        },
        0.68
      )
      .to(meta, { opacity: 1, duration: 0.25, ease: "none" }, 0.85)
      // 5 — Explosive scatter reveal
      .to(
        letters,
        {
          xPercent: () => gsap.utils.random(-120, 120),
          yPercent: () => gsap.utils.random(-180, 180),
          rotation: () => gsap.utils.random(-80, 80),
          opacity: 0,
          duration: 0.35,
          stagger: 0.015,
          ease: "power2.in",
        },
        1.3
      )
      .to(meta, { opacity: 0, duration: 0.18, ease: "none" }, 1.3)
      .to(panel, { yPercent: -104, duration: 0.42 }, 1.4)
      .to(
        cols,
        { yPercent: -104, duration: 0.48, stagger: { each: 0.04, from: "end" } },
        1.45
      );
  }, [activeTab, contentTab, setContentTab]);

  const currentMeta = TAB_CONFIG[activeTab] || TAB_CONFIG.studio;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[92] overflow-hidden pointer-events-none"
      style={{ visibility: "hidden" }}
      aria-hidden="true"
    >
      {/* Background flood */}
      <div className="pt-panel bg-volt" />

      {/* Seven void columns */}
      {Array.from({ length: COLS }).map((_, i) => (
        <div
          key={i}
          className="pt-col bg-void"
          style={{ left: `${(i * 100) / COLS}%`, width: `${100 / COLS + 0.3}%` }}
        />
      ))}

      {/* Kinetic Destination Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="pt-meta font-mono text-[10px] sm:text-xs tracking-[0.4em] text-volt uppercase mb-4 font-bold">
          {currentMeta.tag}
        </p>
        <h2 className="flex justify-center leading-[0.9] select-none">
          {currentMeta.word.split("").map((ch, i) => (
            <span
              key={`${currentMeta.word}-${i}`}
              className="pt-letter inline-block font-extrabold type-xwide text-volt text-[20vw] sm:text-[15vw]"
            >
              {ch}
            </span>
          ))}
        </h2>
        <p className="pt-meta font-mono text-[10px] tracking-[0.25em] text-bone/45 mt-6 uppercase">
          {currentMeta.sub}
        </p>
      </div>
    </div>
  );
}
