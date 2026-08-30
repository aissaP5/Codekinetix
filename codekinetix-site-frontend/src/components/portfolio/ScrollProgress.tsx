"use client";

import { useEffect, useRef } from "react";

/**
 * Volt rail — a hairline progress line pinned to the top edge of the
 * scroll viewport. Fills as you travel through the current section.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const scroller = bar?.closest("main");
    if (!bar || !scroller) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = scroller.scrollHeight - scroller.clientHeight;
      const p = max > 0 ? scroller.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 h-0 pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="h-[2px] w-full origin-left bg-volt shadow-[0_0_14px_rgba(58,111,255,0.9)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
