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
    tag: "01",
    sub: "DIGITAL EXPERIENCE FLAGSHIP",
    accent: "#c6ff00",
  },
  works: {
    word: "WORKS",
    tag: "02",
    sub: "SELECTED CASE ARCHIVE",
    accent: "#f2f1ea",
  },
  about: {
    word: "ABOUT",
    tag: "03",
    sub: "CREATIVE ENGINEERING DNA",
    accent: "#c6ff00",
  },
  contact: {
    word: "CONTACT",
    tag: "04",
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
      // 1 — Backdrop rises swiftly to establish instant full coverage
      .to(panel, { yPercent: 0, duration: 0.28, ease: "power4.out" }, 0)
      // 2 — Columns cascade over backdrop in parallel
      .to(cols, { yPercent: 0, duration: 0.3, stagger: 0.015, ease: "power4.out" }, 0)
      // 3 — Swap content underneath while completely covered
      .call(() => setContentTab(activeTab), [], 0.32)
      // 4 — Destination letters fall in with elastic bounce
      .to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.36,
          stagger: 0.025,
          ease: "back.out(1.8)",
        },
        0.34
      )
      .to(meta, { opacity: 1, duration: 0.2, ease: "none" }, 0.44)
      // 5 — Explosive scatter reveal & uncover
      .to(
        letters,
        {
          xPercent: () => gsap.utils.random(-120, 120),
          yPercent: () => gsap.utils.random(-180, 180),
          rotation: () => gsap.utils.random(-80, 80),
          opacity: 0,
          duration: 0.28,
          stagger: 0.012,
          ease: "power2.in",
        },
        0.82
      )
      .to(meta, { opacity: 0, duration: 0.15, ease: "none" }, 0.82)
      .to(panel, { yPercent: -104, duration: 0.35, ease: "power3.inOut" }, 0.9)
      .to(
        cols,
        { yPercent: -104, duration: 0.38, stagger: { each: 0.025, from: "end" }, ease: "power3.inOut" },
        0.92
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
