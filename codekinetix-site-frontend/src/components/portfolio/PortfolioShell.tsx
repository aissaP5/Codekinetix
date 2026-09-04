"use client";

import { useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useKinetix, type TabId } from "@/lib/store";
import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/portfolio/Preloader";
import BottomNav from "@/components/portfolio/BottomNav";
import Footer from "@/components/portfolio/Footer";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import ProjectShell from "@/components/project/ProjectShell";
import ProjectTransition from "@/components/project/ProjectTransition";
import PageTransition, { navigateWithTransition } from "@/components/portfolio/PageTransition";
import CustomCursor from "@/components/portfolio/CustomCursor";

function getTabFromPath(path: string): TabId | null {
  if (path === "/") return "studio";
  if (path.startsWith("/works")) return "works";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/contact")) return "contact";
  return null;
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
  const prevPathnameRef = useRef(pathname);

  // Sync state on route change (e.g. browser back/forward or initial load)
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      if (targetTab) {
        setActiveTab(targetTab);
        setContentTab(targetTab);
      }
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
      const t = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [pathname, targetTab, setActiveTab, setContentTab, scrollRef]);

  return <div>{children}</div>;
}

export default function PortfolioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = useKinetix((s) => s.phase);

  const handleLinkClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;

    // Ignore external, hash links, new tabs, modifier keys
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      anchor.target === "_blank" ||
      anchor.hasAttribute("download") ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    // Ignore same-page clicks
    const cleanHref = href.split("?")[0].split("#")[0];
    const cleanCurrent = pathname.split("?")[0].split("#")[0];
    if (cleanHref === cleanCurrent && !href.includes("?")) {
      e.preventDefault();
      return;
    }

    // Bypass full-screen curtain transition for utility / legal pages so they navigate immediately
    if (cleanHref.startsWith("/privacy") || cleanHref.startsWith("/terms")) {
      return;
    }

    // Intercept internal page navigation: play cover curtain BEFORE changing route
    e.preventDefault();
    e.stopPropagation();
    navigateWithTransition(href, (url) => router.push(url));
  };

  return (
    <div
      onClickCapture={handleLinkClickCapture}
      className="h-dvh flex flex-col overflow-hidden bg-void text-bone relative"
    >
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
