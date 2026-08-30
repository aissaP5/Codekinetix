"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useKinetix, type TabId } from "@/lib/store";
import AboutView from "./AboutView";

/* R33 — LAZY VIEW SPLIT: WorksView and CareerView are not part of the
   first paint, so they no longer pay their way into the initial
   chunk — the refresh downloads and hydrates less before the boot
   page can even start. The chunks are warmed on idle right after
   mount, so the first works/career click never waits on a fetch (the
   swap itself lands under the ~2.3s transition cover regardless).
   AboutView stays static — it IS the first paint. */
const WorksView = dynamic(() => import("./WorksView"), { ssr: false });
const CareerView = dynamic(() => import("./CareerView"), { ssr: false });

const VIEWS: Record<TabId, React.ComponentType> = {
  works: WorksView,
  about: AboutView,
  career: CareerView,
};

/**
 * Renders the contentTab — the swap happens under the PageTransition
 * overlay (it flips contentTab while the screen is covered), so no
 * secondary fade is needed here.
 */
export default function ViewSwitcher({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const contentTab = useKinetix((s) => s.contentTab);

  useEffect(() => {
    // R31 — INSTANT reset. The main scroller has scroll-behavior:smooth,
    // so the old plain scrollTo({top:0}) animated the whole journey back
    // from a deep WORKS scroll — replaying the sticky deck + every scrub
    // trigger frame-by-frame UNDER the transition cover, where nobody
    // could see it. One jump, one layout, done.
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [contentTab, scrollRef]);

  // R33 — warm the lazy view chunks once the browser is idle.
  useEffect(() => {
    const warm = () => {
      void import("./WorksView");
      void import("./CareerView");
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let done = false;
    const run = () => {
      if (!done) {
        done = true;
        warm();
      }
    };
    let ricId = 0;
    let tid = 0;
    if (w.requestIdleCallback) {
      ricId = w.requestIdleCallback(run, { timeout: 2000 });
    } else {
      tid = window.setTimeout(run, 1200);
    }
    return () => {
      done = true;
      if (ricId) w.cancelIdleCallback?.(ricId);
      if (tid) window.clearTimeout(tid);
    };
  }, []);

  const View = VIEWS[contentTab];
  return (
    <div>
      <View />
    </div>
  );
}
