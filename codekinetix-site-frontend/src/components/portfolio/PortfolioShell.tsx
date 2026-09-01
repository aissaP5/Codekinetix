"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useKinetix, type TabId } from "@/lib/store";
import Preloader from "@/components/portfolio/Preloader";
import BottomNav from "@/components/portfolio/BottomNav";
import Footer from "@/components/portfolio/Footer";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import ProjectShell from "@/components/project/ProjectShell";
import ProjectTransition from "@/components/project/ProjectTransition";
import PageTransition from "@/components/portfolio/PageTransition";
import CustomCursor from "@/components/portfolio/CustomCursor";

function getTabFromPath(path: string): TabId {
  if (path === "/") return "studio";
  if (path.startsWith("/works")) return "works";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/lab")) return "lab";
  if (path.startsWith("/contact")) return "contact";
  return "studio";
}

function RouteTransitionContainer({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname();
  const targetTab = getTabFromPath(pathname);
  const activeTab = useKinetix((s) => s.activeTab);
  const contentTab = useKinetix((s) => s.contentTab);
  const setActiveTab = useKinetix((s) => s.setActiveTab);
  const setContentTab = useKinetix((s) => s.setContentTab);
  const phase = useKinetix((s) => s.phase);

  // Keep track of the currently displayed children during transitions
  const [displayedChildren, setDisplayedChildren] = useState<React.ReactNode>(children);
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  // Sync activeTab when pathname changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setActiveTab(targetTab);
      setContentTab(targetTab);
      setDisplayedChildren(children);
      prevPathnameRef.current = pathname;
      return;
    }

    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      if (activeTab !== targetTab) {
        setActiveTab(targetTab);
      }
    }
  }, [pathname, targetTab, activeTab, setActiveTab, setContentTab, children]);

  // When contentTab flips to targetTab under the cover,
  // update the displayed children and reset the scroll position
  useEffect(() => {
    if (contentTab === targetTab) {
      setDisplayedChildren(children);
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [contentTab, targetTab, children, scrollRef]);

  // When phase becomes "site" on initial load, ensure children are set
  useEffect(() => {
    if (phase === "site" && contentTab === targetTab) {
      setDisplayedChildren(children);
    }
  }, [phase, contentTab, targetTab, children]);

  return <div>{displayedChildren}</div>;
}

export default function PortfolioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = useKinetix((s) => s.phase);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-void text-bone relative">
      <CustomCursor />
      <Preloader />

      {/* technical grid — the skeleton under everything */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-grid-dark mobile-hide-overlay"
        aria-hidden="true"
      />

      {/* film grain over the whole experience — texture, never flat */}
      <div
        className="pointer-events-none fixed inset-0 z-[97] noise-overlay opacity-[0.055] mobile-hide-overlay"
        aria-hidden="true"
      />

      <div
        className={`flex-1 min-h-0 flex flex-col ${
          phase === "project" ? "hidden" : "flex"
        }`}
        aria-hidden={phase === "project"}
      >
        <main
          ref={scrollRef}
          className="relative z-10 flex-1 min-h-0 overflow-y-auto ck-scroll"
        >
          <ScrollProgress />
          <RouteTransitionContainer scrollRef={scrollRef}>
            {children}
          </RouteTransitionContainer>
          <Footer />
        </main>
        <BottomNav />
      </div>

      {/* embedded project system — lives above everything */}
      <ProjectShell />
      <ProjectTransition />

      {/* section transitions — page-specific motion */}
      <PageTransition />
    </div>
  );
}
