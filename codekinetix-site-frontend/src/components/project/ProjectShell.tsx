"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { getSlot } from "@/lib/projects";

/**
 * Full-screen embedded project view. Projects live INSIDE the site —
 * each build is served from /projects/<id>/ and rendered here through
 * an iframe, framed by the studio toolbar with a back action.
 */
export default function ProjectShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeProject = useKinetix((s) => s.activeProject);
  const phase = useKinetix((s) => s.phase);
  const exitProject = useKinetix((s) => s.exitProject);
  const [loaded, setLoaded] = useState(false);

  const slot = getSlot(activeProject);

  // fresh load state whenever we step into another project
  useEffect(() => {
    setLoaded(false);
  }, [activeProject]);

  // Escape always steps back out to the works deck
  useEffect(() => {
    if (!slot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitProject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slot, exitProject]);

  useEffect(() => {
    if (!rootRef.current || !slot) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ps-enter",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, delay: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(
        ".ps-frame",
        { opacity: 0, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [activeProject, slot]);

  if (!slot) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] bg-void text-bone flex flex-col">
      {/* toolbar */}
      <div className="ps-enter relative z-20 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 border-b border-bone/10 bg-void">
        <button
          onClick={exitProject}
          className="group flex items-center gap-2 bg-bone text-void font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] px-4 py-2 hover:bg-volt transition-colors duration-300"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-300">←</span>{" "}
          BACK TO WORKS
        </button>

        <div className="hidden md:flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-ash min-w-0">
          <span className="text-bone font-medium shrink-0">
            {slot.index} — {slot.name}
          </span>
          <span className="w-px h-3 bg-bone/15" aria-hidden="true" />
          <span className="truncate">{slot.tagline}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={slot.path}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 border border-bone/20 font-mono text-[10px] tracking-[0.2em] px-3 py-2 hover:border-volt hover:text-volt transition-colors duration-300"
          >
            STANDALONE <span aria-hidden="true">↗</span>
          </a>
          <span className="font-mono text-[10px] tracking-[0.2em] text-volt border border-volt/40 px-3 py-2">
            EMBEDDED VIEW
          </span>
        </div>
      </div>

      {/* the project itself — embedded build */}
      <div className="ps-frame relative flex-1 min-h-0 bg-bone">
        {phase === "project" && (
          <iframe
            src={slot.path}
            title={`${slot.name} — embedded project`}
            className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            allow="clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          />
        )}

        {/* loading plate — covers the iframe until its first paint */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-void text-bone">
            <div className="bg-grid-dark absolute inset-0 pointer-events-none" aria-hidden="true" />

            {/* corner ticks */}
            <span className="absolute top-5 left-5 w-3 h-3 border-t border-l border-bone/25" aria-hidden="true" />
            <span className="absolute top-5 right-5 w-3 h-3 border-t border-r border-bone/25" aria-hidden="true" />
            <span className="absolute bottom-5 left-5 w-3 h-3 border-b border-l border-bone/25" aria-hidden="true" />
            <span className="absolute bottom-5 right-5 w-3 h-3 border-b border-r border-bone/25" aria-hidden="true" />

            <div className="relative text-center px-6">
              <p className="font-mono text-[10px] tracking-[0.35em] text-ash mb-5">
                {slot.index} — {slot.tagline}
              </p>
              <h2 className="font-extrabold type-xwide uppercase leading-none tracking-[-0.02em] text-[10vw] sm:text-[5vw] mb-7">
                {slot.name}
              </h2>
              <div className="mx-auto h-[3px] w-[min(60vw,320px)] bg-bone/15 overflow-hidden">
                <div className="ps-load-bar h-full w-full origin-left bg-volt" />
              </div>
              <p className="mt-5 font-mono text-[9px] tracking-[0.3em] text-ash">
                LOADING PROJECT
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
