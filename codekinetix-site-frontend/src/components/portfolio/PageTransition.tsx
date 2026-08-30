"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix, type TabId } from "@/lib/store";
import { curtain } from "@/lib/curtain";

/**
 * Section transition — the column wave + falling letters.
 *
 * 1. An volt panel rises with a skew wobble, then seven void columns
 *    cascade up over it — the volt flashes through the gaps as they stack.
 * 2. While fully covered, the view swaps underneath.
 * 3. The destination word's letters FALL in — bounce + rotation.
 * 4. Letters EXPLODE outward in random directions, then the columns
 *    cascade down (reversed stagger) revealing the new section.
 */
const WORD: Record<TabId, string> = {
  about: "ABOUT",
  works: "WORKS",
  career: "CAREER",
};
const INDEX: Record<TabId, string> = {
  about: "01",
  works: "02",
  career: "03",
};

const COLS = 7;

export default function PageTransition() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeTab = useKinetix((s) => s.activeTab);
  const contentTab = useKinetix((s) => s.contentTab);
  const setContentTab = useKinetix((s) => s.setContentTab);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // R31 — curtain balance: a timeline killed mid-flight never reaches
  // its onComplete, so its cover() must be rebalanced here before the
  // fresh one covers again (rapid tab clicks).
  const coveredRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || activeTab === contentTab) return;

    // if a previous transition is mid-flight (rapid tab clicks) —
    // kill it, hard-reset everything below the fold, play fresh
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
      rotation: () => gsap.utils.random(-30, 30),
    });
    gsap.set(meta, { opacity: 0 });

    // R31 — announce the cover: the view mounting at 0.8s (and anything
    // else alive underneath) stops painting while the screen is hidden
    // and resumes as the columns lift. Uncovered on completion above.
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
      // 1 — volt panel floods up with a wobble
      .to(panel, { yPercent: 0, duration: 0.45 }, 0)
      .to(panel, { skewY: -3, duration: 0.16, ease: "sine.inOut" }, 0.05)
      .to(panel, { skewY: 0, duration: 0.2, ease: "sine.inOut" }, 0.3)
      // 2 — void columns cascade over it (volt flashes between them)
      .to(cols, { yPercent: 0, duration: 0.5, stagger: 0.05 }, 0.18)
      .to(cols, { skewY: -3, duration: 0.14, ease: "sine.inOut", stagger: 0.05 }, 0.24)
      .to(cols, { skewY: 0, duration: 0.18, ease: "sine.inOut", stagger: 0.05 }, 0.5)
      // 3 — swap the view while covered
      .call(() => setContentTab(activeTab), [], 0.8)
      // 4 — destination letters FALL onto the void
      .to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "back.out(1.9)",
        },
        0.84
      )
      .to(meta, { opacity: 1, duration: 0.3, ease: "none" }, 1.05)
      // 5 — letters EXPLODE outward, everything cascades down
      .to(
        letters,
        {
          xPercent: () => gsap.utils.random(-140, 140),
          yPercent: () => gsap.utils.random(-220, 220),
          rotation: () => gsap.utils.random(-100, 100),
          opacity: 0,
          duration: 0.42,
          stagger: 0.02,
          ease: "power2.in",
        },
        1.62
      )
      .to(meta, { opacity: 0, duration: 0.2, ease: "none" }, 1.62)
      .to(panel, { yPercent: -104, duration: 0.5 }, 1.72)
      .to(
        cols,
        { yPercent: -104, duration: 0.55, stagger: { each: 0.05, from: "end" } },
        1.8
      );
    // NOTE: intentionally no cleanup kill — the timeline must survive the
    // contentTab state flip it triggers at 0.8s.
  }, [activeTab, contentTab, setContentTab]);

  const word = WORD[activeTab];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[92] overflow-hidden pointer-events-none"
      style={{ visibility: "hidden" }}
      aria-hidden="true"
    >
      {/* back layer — volt flood */}
      <div className="pt-panel bg-volt" />

      {/* front layer — seven void columns */}
      {Array.from({ length: COLS }).map((_, i) => (
        <div
          key={i}
          className="pt-col bg-void"
          style={{ left: `${(i * 100) / COLS}%`, width: `${100 / COLS + 0.25}%` }}
        />
      ))}

      {/* falling letters */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="pt-meta font-mono text-[10px] sm:text-[11px] tracking-[0.45em] text-volt mb-4">
          ENTERING
        </p>
        <h2 className="flex justify-center leading-[0.95]">
          {word.split("").map((ch, i) => (
            <span
              key={`${word}-${i}`}
              className="pt-letter inline-block font-extrabold type-xwide text-volt text-[18vw] sm:text-[14vw]"
            >
              {ch}
            </span>
          ))}
        </h2>
        <p className="pt-meta font-mono text-[10px] tracking-[0.3em] text-bone/40 mt-6">
          {INDEX[activeTab]} / 03
        </p>
      </div>
    </div>
  );
}
