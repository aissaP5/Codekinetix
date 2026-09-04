"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix, type TabId } from "@/lib/store";
import { curtain } from "@/lib/curtain";
import { getSlot } from "@/lib/projects";

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

let navHandler: ((href: string, push: (url: string) => void) => void) | null = null;

export function navigateWithTransition(href: string, push: (url: string) => void) {
  if (navHandler) {
    navHandler(href, push);
  } else {
    push(href);
  }
}

function getTransitionMeta(href: string): {
  word: string;
  tag: string;
  sub: string;
  accent: string;
  targetTab: TabId;
} {
  const path = href.split("?")[0].split("#")[0];

  // Specific project case study routes: /works/[slug]
  if (path.startsWith("/works/")) {
    const slug = path.replace(/^\/works\//, "").replace(/\/$/, "");
    const slot = getSlot(slug);
    if (slot) {
      return {
        word: slot.name,
        tag: slot.index,
        sub: `${slot.index} — ${slot.tagline}`,
        accent: "#3a6fff",
        targetTab: "works",
      };
    }
  }

  if (path === "/" || path === "") {
    return { ...TAB_CONFIG.studio, targetTab: "studio" };
  }
  if (path === "/works" || path === "/works/") {
    return { ...TAB_CONFIG.works, targetTab: "works" };
  }
  if (path.startsWith("/about")) {
    return { ...TAB_CONFIG.about, targetTab: "about" };
  }
  if (path.startsWith("/contact")) {
    return { ...TAB_CONFIG.contact, targetTab: "contact" };
  }

  return { ...TAB_CONFIG.studio, targetTab: "studio" };
}

export default function PageTransition() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeTab = useKinetix((s) => s.activeTab);
  const contentTab = useKinetix((s) => s.contentTab);
  const setActiveTab = useKinetix((s) => s.setActiveTab);
  const setContentTab = useKinetix((s) => s.setContentTab);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isTransitioningRef = useRef(false);

  // Register global transition trigger
  useEffect(() => {
    navHandler = (href: string, push: (url: string) => void) => {
      const root = rootRef.current;
      if (!root) {
        push(href);
        return;
      }

      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const meta = getTransitionMeta(href);
      const targetTab = meta.targetTab;

      // Update text in transition overlay before animating
      const wordEl = root.querySelector<HTMLElement>(".pt-word");
      const subEl = root.querySelector<HTMLElement>(".pt-sub");
      if (wordEl) wordEl.textContent = meta.word;
      if (subEl) subEl.textContent = meta.sub;

      tlRef.current?.kill();

      const panel = root.querySelector<HTMLElement>(".pt-panel");
      const cols = gsap.utils.toArray<HTMLElement>(".pt-col", root);
      const content = root.querySelector<HTMLElement>(".pt-content");

      gsap.set(root, { visibility: "visible" });
      gsap.set(panel, { yPercent: 100 });
      gsap.set(cols, { yPercent: 100 });
      gsap.set(content, { opacity: 0, y: 15 });

      curtain.cover();

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { visibility: "hidden" });
          gsap.set([panel, ...cols], { yPercent: 100 });
          tlRef.current = null;
          curtain.uncover();
          isTransitioningRef.current = false;
          requestAnimationFrame(() => {
            import("@/lib/gsap").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
            });
          });
        },
      });
      tlRef.current = tl;

      tl
        // 1 — Backdrop and columns rise smoothly over current page to establish full coverage
        .to(panel, { yPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0)
        .to(cols, { yPercent: 0, duration: 0.45, stagger: 0.02, ease: "power3.inOut" }, 0)
        // 2 — Screen is 100% COVERED: now execute route navigation under the curtain!
        .call(() => {
          push(href);
          setActiveTab(targetTab);
          setContentTab(targetTab);
        }, [], 0.42)
        // 3 — Destination typography fades in smoothly while screen is covered
        .to(content, { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }, 0.38)
        // 4 — Hold then fade out typography
        .to(content, { opacity: 0, y: -16, duration: 0.2, ease: "power2.in" }, 0.72)
        // 5 — Uncover upward to reveal the newly mounted destination page!
        .to(panel, { yPercent: -101, duration: 0.48, ease: "power3.inOut" }, 0.8)
        .to(cols, { yPercent: -101, duration: 0.52, stagger: 0.02, ease: "power3.inOut" }, 0.8);
    };

    return () => {
      navHandler = null;
    };
  }, [setActiveTab, setContentTab]);

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
        <h2 className="pt-word font-extrabold type-xwide uppercase text-bone text-4xl sm:text-6xl tracking-tight select-none">
          {currentMeta.word}
        </h2>
        <p className="pt-sub font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-bone/50 mt-4 uppercase">
          {currentMeta.sub}
        </p>
      </div>
    </div>
  );
}
