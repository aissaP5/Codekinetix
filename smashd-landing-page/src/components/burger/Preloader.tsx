"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HERO_BURGER } from "@/lib/burger";

const LINE_ART = [
  // dome
  "M 30 72 Q 30 24 100 24 Q 170 24 170 72",
  // sesame seeds
  "M 70 44 L 75 39",
  "M 100 35 L 100 41",
  "M 130 44 L 125 39",
  "M 58 58 L 64 54",
  "M 142 58 L 136 54",
  // lettuce wave
  "M 28 80 Q 38 72 48 80 Q 58 88 68 80 Q 78 72 88 80 Q 98 88 108 80 Q 118 72 128 80 Q 138 88 148 80 Q 158 72 172 80",
  // tomato
  "M 46 95 L 154 95",
  // cheese drips
  "M 38 107 Q 50 120 62 107 Q 74 120 86 107 Q 98 120 110 107 Q 122 120 134 107 Q 146 120 162 107",
  // patty
  "M 36 127 L 164 127",
  // heel
  "M 44 145 L 156 145",
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 2.4 : 1; // duration divisor
    const counter = { v: 0 };

    const setCounter = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(counter.v));
      }
    };

    /* ---------- gate the exit on the hero burger being ready ---------- */
    const heroLoaded = new Promise<void>((resolve) => {
      let settled = false;
      const fin = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      const img = new Image();
      img.onload = fin;
      img.onerror = fin;
      window.setTimeout(fin, 4500); // never hold the door too long
      img.src = HERO_BURGER;
    });

    let killed = false;
    let finished = false;
    let revealed = false;
    let stageB: gsap.core.Timeline | null = null;

    /* reveal = hand off to the page (hero intro starts, scroll unlocks).
       Called WHILE the curtain still covers the screen, so the hero's
       from-states never flash — the intro overlaps the wipe. */
    const reveal = () => {
      if (revealed || killed) return;
      revealed = true;
      onComplete();
    };

    /* finish = unmount the preloader (after the wipe is done) */
    const finish = () => {
      if (finished || killed) return;
      finished = true;
      reveal(); // guarantee the page never stays locked
      setGone(true);
    };

    /* hard safety net — the site can never stay locked */
    const safety = window.setTimeout(finish, 8000);

    /* initial states (matching units so the wipe interpolates smoothly) */
    gsap.set(".draw-line", { strokeDashoffset: 1 });
    gsap.set(root, { clipPath: "inset(0% 0% 0% 0%)" });
    /* counter jumps to a live value immediately — never a static 0 frame */
    counter.v = 1;
    setCounter();

    /* ---------- stage A: line art + counter ramp ---------- */
    const stageA = gsap.timeline();
    stageA
      .fromTo(
        ".draw-line",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.55 / speed,
          stagger: 0.09 / speed,
          ease: "power2.inOut",
        },
        0.15
      )
      .fromTo(
        ".pl-fade",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5 / speed,
          stagger: 0.08 / speed,
          ease: "power3.out",
        },
        0.08
      )
      .to(
        counter,
        {
          v: reduced ? 100 : 92,
          duration: (reduced ? 1.1 : 1.9) / speed,
          ease: "power2.inOut",
          onUpdate: setCounter,
        },
        0.08
      );

    const stageADone = new Promise<void>((resolve) => {
      stageA.eventCallback("onComplete", resolve);
    });

    /* ---------- stage B: assets ready -> complete + exit ---------- */
    Promise.all([stageADone, heroLoaded]).then(() => {
      if (killed || finished) return;

      stageB = gsap.timeline();

      if (reduced) {
        // calm, quick exit — still a real transition, never an instant cut
        stageB
          .to(".pl-inner", { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, "+=0.15")
          .call(reveal) // page intro begins under the fading cover
          .to(root, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.05")
          .call(finish);
      } else {
        stageB
          .to(counter, { v: 100, duration: 0.35, ease: "power1.in", onUpdate: setCounter })
          .to(".pl-inner", { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" }, "+=0.2")
          /* hand off to the page NOW — hero intro initializes behind the
             full-screen curtain, then the wipe reveals it mid-animation */
          .call(reveal, [], "+=0.05")
          .to(
            root,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "power4.inOut" },
            "+=0.1"
          )
          .set(root, { pointerEvents: "none" })
          .call(finish);
      }
    });

    return () => {
      killed = true;
      window.clearTimeout(safety);
      stageA.kill();
      stageB?.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] bg-ink flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="pl-inner flex flex-col items-center gap-8">
        <svg
          viewBox="0 0 200 170"
          className="w-[46vw] max-w-[280px] md:w-[300px]"
          fill="none"
          aria-hidden="true"
        >
          {LINE_ART.map((d, i) => (
            <path
              key={i}
              className="draw-line"
              d={d}
              stroke="#ff5c1f"
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          ))}
        </svg>
        <p className="pl-fade font-sans text-[11px] tracking-[0.35em] text-smoke uppercase">
          Firing up the grill
        </p>
      </div>

      <div className="pl-fade opacity-0 absolute top-6 left-6 md:top-8 md:left-10 font-display text-lg tracking-widest text-foreground">
        SMASH&apos;D<span className="text-ember">.</span>
      </div>
      <div className="pl-fade opacity-0 absolute bottom-6 left-6 md:bottom-8 md:left-10 font-sans text-[11px] tracking-[0.3em] text-smoke uppercase hidden md:block">
        Est. 2024 — Flame Grilled Co.
      </div>
      <div className="pl-fade opacity-0 absolute bottom-4 right-6 md:bottom-6 md:right-10 font-display leading-none text-[26vw] md:text-[13vw] text-foreground/90 tabular-nums flex items-start">
        <span ref={counterRef}>1</span>
        <span className="text-ember text-[8vw] md:text-[4vw] mt-[3vw] md:mt-[1.6vw]">%</span>
      </div>
    </div>
  );
}
