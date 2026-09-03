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
    const content = root.querySelector<HTMLElement>(".pt-content");

    gsap.set(root, { visibility: "visible" });
    gsap.set(panel, { yPercent: 100 });
    gsap.set(cols, { yPercent: 100 });
    gsap.set(content, { opacity: 0, y: 15 });

    curtain.cover();
    coveredRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: "hidden" });
        gsap.set([panel, ...cols], { yPercent: 100 });
        tlRef.current = null;
        curtain.uncover();
        coveredRef.current = false;
        requestAnimationFrame(() => {
          import("@/lib/gsap").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        });
      },
    });
    tlRef.current = tl;

    tl
      // 1 — Backdrop and columns rise swiftly to establish instant full coverage
      .to(panel, { yPercent: 0, duration: 0.24, ease: "power4.out" }, 0)
      .to(cols, { yPercent: 0, duration: 0.26, stagger: 0.012, ease: "power4.out" }, 0)
      // 2 — Swap underlying content while completely covered
      .call(() => setContentTab(activeTab), [], 0.22)
      // 3 — Clean destination typography fade-up
      .to(content, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.18)
      .to(content, { opacity: 0, y: -12, duration: 0.12, ease: "power2.in" }, 0.36)
      // 4 — Uncover upward to reveal the fresh page
      .to(panel, { yPercent: -101, duration: 0.26, ease: "power3.inOut" }, 0.38)
      .to(cols, { yPercent: -101, duration: 0.28, stagger: 0.012, ease: "power3.inOut" }, 0.38);
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
      <div className="pt-content absolute inset-0 flex flex-col items-center justify-center text-center px-4 will-change-transform">
        <h2 className="font-extrabold type-xwide uppercase text-bone text-4xl sm:text-6xl tracking-tight select-none">
          {currentMeta.word}
        </h2>
        <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-bone/50 mt-4 uppercase">
          {currentMeta.sub}
        </p>
      </div>
    </div>
  );
}
