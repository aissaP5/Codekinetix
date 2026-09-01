"use client";

import { useKinetix, type TabId } from "@/lib/store";
import { gsap } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import Link from "next/link";

const TABS: { id: TabId; label: string; href: string }[] = [
  { id: "about", label: "ABOUT", href: "/about" },
  { id: "works", label: "WORKS", href: "/works" },
  { id: "career", label: "CAREER", href: "/career" },
];

export default function BottomNav() {
  const activeTab = useKinetix((s) => s.activeTab);
  const pillRef = useRef<HTMLDivElement>(null);

  // animated active pill. On mobile the mono font lands AFTER first paint,
  // button widths change, and the pill (sized to fallback metrics) ends up
  // sitting between buttons = "blue not on the button". Fix: a ResizeObserver
  // on the row re-places the pill INSTANTLY whenever layout shifts (font
  // swap, resize, rotation); tab changes still animate.
  useEffect(() => {
    const el = pillRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const place = (animate: boolean) => {
      const active = parent.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
      if (!active) return;
      gsap.to(el, {
        x: active.offsetLeft,
        width: active.offsetWidth,
        duration: animate ? 0.45 : 0,
        ease: "power3.out",
        overwrite: true,
      });
    };
    place(true);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(parent);
    return () => ro.disconnect();
  }, [activeTab]);

  return (
    <nav
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
      aria-label="Main sections"
    >
      <div className="flex items-center bg-void text-bone rounded-full px-2 py-2 border border-bone/15 shadow-[0_12px_44px_rgba(0,0,0,0.6),0_0_34px_rgba(58,111,255,0.28)]">
        <div className="relative flex items-center">
          <div
            ref={pillRef}
            className="absolute top-0 left-0 h-[38px] rounded-full bg-volt"
            style={{ width: 90 }}
            aria-hidden="true"
          />
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              data-tab={t.id}
              className={`relative z-10 flex items-center justify-center h-[38px] px-5 sm:px-8 rounded-full font-mono text-[11px] tracking-[0.18em] select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] transition-colors duration-300 ${
                activeTab === t.id
                  ? "text-void font-bold"
                  : "text-bone/55 [@media(hover:hover)]:hover:text-bone"
              }`}
              aria-current={activeTab === t.id ? "page" : undefined}
            >
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
