"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useKinetix, type TabId } from "@/lib/store";

const TABS = [
  { id: "studio", label: "STUDIO", href: "/" },
  { id: "works", label: "WORKS", href: "/works" },
  { id: "about", label: "ABOUT", href: "/about" },
  { id: "contact", label: "CONTACT", href: "/contact" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const pillRef = useRef<HTMLDivElement>(null);
  const setActiveTab = useKinetix((s) => s.setActiveTab);

  // Determine active tab from pathname
  const activeTabId =
    pathname === "/"
      ? "studio"
      : pathname.startsWith("/works")
      ? "works"
      : pathname.startsWith("/about")
      ? "about"
      : pathname.startsWith("/contact")
      ? "contact"
      : "studio";

  useEffect(() => {
    const el = pillRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const place = (animate: boolean) => {
      const active = parent.querySelector<HTMLElement>(`[data-tab="${activeTabId}"]`);
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
  }, [activeTabId]);

  const handleTabClick = (tabId: string) => {
    if (activeTabId !== tabId) {
      setActiveTab(tabId as TabId);
    }
  };

  return (
    <nav
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[95vw]"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center bg-void text-bone rounded-full px-1.5 py-1.5 border border-bone/15 shadow-[0_12px_44px_rgba(0,0,0,0.6),0_0_34px_rgba(58,111,255,0.28)]">
        <div className="relative flex items-center overflow-x-auto no-scrollbar">
          {/* Animated active volt pill */}
          <div
            ref={pillRef}
            className="absolute top-0 left-0 h-[36px] rounded-full bg-volt"
            style={{ width: 80 }}
            aria-hidden="true"
          />

          {TABS.map((t) => {
            const isCurrent = activeTabId === t.id;
            return (
              <Link
                key={t.id}
                href={t.href}
                data-tab={t.id}
                onClick={() => handleTabClick(t.id)}
                className={`relative z-10 flex items-center justify-center h-[36px] px-3.5 sm:px-6 rounded-full font-mono text-[10px] sm:text-[11px] tracking-[0.16em] select-none [-webkit-tap-highlight-color:transparent] transition-colors duration-300 ${
                  isCurrent
                    ? "text-void font-bold"
                    : "text-bone/55 hover:text-bone"
                }`}
                aria-current={isCurrent ? "page" : undefined}
              >
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
