"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";
import { getSlot } from "@/lib/projects";

/**
 * Full-screen volt wipe that plays on every project open / close:
 * volt floods the screen, the project label's letters fall in,
 * the view swaps underneath, then it drains upward.
 */
export default function ProjectTransition() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // R31 — curtain balance (same pattern as PageTransition)
  const coveredRef = useRef(false);

  const phase = useKinetix((s) => s.phase);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || phase !== "opening") return;

    const projectId = useKinetix.getState().activeProject;
    const slot = getSlot(projectId);

    // entering a project — or returning to the portfolio
    const label = slot ? slot.name : "THE STUDIO";
    const sub = slot ? `OPENING — ${slot.tagline}` : "BACK TO THE PORTFOLIO";

    // build falling letters for the label
    if (labelRef.current) {
      labelRef.current.textContent = "";
      label.split("").forEach((ch) => {
        const s = document.createElement("span");
        s.className = "ptc inline-block";
        s.textContent = ch;
        labelRef.current!.appendChild(s);
      });
    }
    const subEl = root.querySelector<HTMLElement>(".pt-sub");
    if (subEl) subEl.textContent = sub;

    const chars = gsap.utils.toArray<HTMLElement>(".ptc", root);

    // kill any previous run (e.g. rapid double click) — but NEVER kill on
    // phase change: this timeline itself flips the phase mid-flight and must
    // keep running to wipe the overlay away.
    if (coveredRef.current) {
      curtain.uncover();
      coveredRef.current = false;
    }
    tlRef.current?.kill();
    gsap.set(root, { display: "flex", clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(chars, {
      yPercent: -170,
      opacity: 0,
      rotation: () => gsap.utils.random(-24, 24),
    });
    gsap.set(barRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: "none" });
        // R31 — the portfolio (particle word included) may have just
        // remounted under this wipe: it stopped painting while covered,
        // let it resume
        curtain.uncover();
        coveredRef.current = false;
      },
    });
    tlRef.current = tl;
    // R31 — announce the cover for the whole wipe window (open AND exit)
    curtain.cover();
    coveredRef.current = true;

    // 1. volt floods up to cover the screen
    tl.to(root, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.inOut" })
      // 2. label letters fall in + progress line fills
      .to(
        chars,
        {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "back.out(1.9)",
        },
        "-=0.08"
      )
      .to(barRef.current, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.5")
      // 3. swap the underlying view while covered
      .call(() => {
        const store = useKinetix.getState();
        if (projectId) store.projectReady();
        else store.siteReady();
      })
      // 4. brief beat then drain away upward
      .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.55, ease: "power3.inOut" }, "+=0.15")
      .set(root, { display: "none", clipPath: "inset(100% 0% 0% 0%)" });
    // NOTE: intentionally no cleanup kill — the timeline completes on its own
    // even after the phase flips mid-animation. Killing here would freeze the
    // overlay on screen.
  }, [phase]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[95] hidden flex-col items-center justify-center bg-volt text-void"
      style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <p className="pt-sub font-mono text-[10px] tracking-[0.35em] text-void/70 mb-5">
        OPENING PROJECT
      </p>
      <h2 className="overflow-hidden" aria-hidden="true">
        <span
          ref={labelRef}
          className="block font-extrabold type-xwide uppercase leading-none tracking-[-0.02em] text-[13vw] sm:text-[7vw]"
        >
          SLOT 01
        </span>
      </h2>
      <div className="mt-8 h-[3px] w-[min(60vw,320px)] bg-void/25 overflow-hidden">
        <div ref={barRef} className="h-full w-full origin-left bg-void" />
      </div>
    </div>
  );
}
