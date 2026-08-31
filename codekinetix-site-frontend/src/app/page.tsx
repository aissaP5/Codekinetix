"use client";

import { useRef } from "react";
import { useKinetix } from "@/lib/store";
import Preloader from "@/components/portfolio/Preloader";
import TopBar from "@/components/portfolio/TopBar";
import BottomNav from "@/components/portfolio/BottomNav";
import ViewSwitcher from "@/components/portfolio/ViewSwitcher";
import Marquee from "@/components/portfolio/Marquee";
import Footer from "@/components/portfolio/Footer";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import ProjectShell from "@/components/project/ProjectShell";
import ProjectTransition from "@/components/project/ProjectTransition";
import PageTransition from "@/components/portfolio/PageTransition";


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = useKinetix((s) => s.phase);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-void text-bone">
      <Preloader />

      {/* technical grid — the skeleton under everything */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-dark mobile-hide-overlay" aria-hidden="true" />

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
        <TopBar />
        <main
          ref={scrollRef}
          className="relative z-10 flex-1 min-h-0 overflow-y-auto ck-scroll"
        >
          <ScrollProgress />
          <Marquee />
          <ViewSwitcher scrollRef={scrollRef} />
          <Footer />
        </main>
        <BottomNav />
      </div>

      {/* embedded project system — lives above everything */}
      <ProjectShell />
      <ProjectTransition />

      {/* section transitions — column wave + falling letters */}
      <PageTransition />

    </div>
  );
}
