"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import ProjectForm from "@/components/portfolio/ProjectForm";

export default function ContactDrawer() {
  const contactOpen = useKinetix((s) => s.contactOpen);
  const closeContact = useKinetix((s) => s.closeContact);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && contactOpen) {
        closeContact();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen, closeContact]);

  // Entrance & Exit animations
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (contactOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "block" });
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power4.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, {
        xPercent: 100,
        duration: 0.35,
        ease: "power3.in",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [contactOpen, closeContact]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[95] bg-void/80 backdrop-blur-md opacity-0 pointer-events-auto"
      style={{ display: "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0"
        onClick={closeContact}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-2xl bg-panel text-bone border-l border-bone/15 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-bone/10 bg-void">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-volt rotate-45" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-bone font-bold">
              START A PROJECT
            </span>
          </div>
          <button
            onClick={closeContact}
            className="group font-mono text-[10px] tracking-[0.2em] px-3 py-1.5 border border-bone/20 text-ash hover:border-volt hover:text-volt transition-colors [-webkit-tap-highlight-color:transparent]"
            aria-label="Close contact drawer"
          >
            CLOSE [ESC] ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 ck-scroll">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
