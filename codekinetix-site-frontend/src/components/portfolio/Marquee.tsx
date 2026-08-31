"use client";

import { useEffect, useRef } from "react";

interface MarqueeProps {
  items?: string[];
  className?: string;
  /** base drift direction — default runs right-to-left */
  reverse?: boolean;
  /** "strip" = loud volt banner · "display" = giant solid/outline word band */
  variant?: "strip" | "display";
}

const DEFAULT_ITEMS = [
  "AVAILABLE FOR NEW PROJECTS",
  "SITES — SHOPS — WEB APPS",
  "NEXT.JS · TYPESCRIPT · GSAP · WEBGL",
  "REMOTE — WORLDWIDE",
];

/**
 * Volt ticker — movement is a pure CSS compositor animation (translateX
 * loop over two identical copies), so it NEVER stalls. A thin JS layer
 * adds the juice on top: scroll velocity boosts the playback rate, hard
 * reverse scrolling flips the drift, and the whole strip skews with
 * momentum. Animation always runs — this is a motion showcase site.
 */
export default function Marquee({
  items = DEFAULT_ITEMS,
  className = "",
  reverse = false,
  variant = "strip",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const skewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const skew = skewRef.current;
    const scroller = track?.closest("main");
    if (!track || !skew || !scroller) return;

    const getAnims = () =>
      typeof (track as HTMLElement).getAnimations === "function"
        ? (track as HTMLElement).getAnimations()
        : [];

    let raf = 0;
    let vel = 0;
    let lastTop = scroller.scrollTop;
    let curSkew = 0;
    let curRate = 1;
    let writtenRate = 1;
    let writtenSkew = false;

    let isIntersecting = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          isIntersecting = en.isIntersecting;
          if (track) {
            track.style.animationPlayState = isIntersecting ? "running" : "paused";
          }
          if (isIntersecting) {
            wake();
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(track);

    /* the CSS loop keeps the band moving compositor-side; the JS layer
       only wakes while scroll momentum exists, then parks itself —
       zero per-frame JS at rest (low-end friendly). */
    const tick = () => {
      if (!isIntersecting) {
        raf = 0;
        return;
      }
      const top = scroller.scrollTop;
      vel += (top - lastTop) * 0.6; // scroll impulse
      vel *= 0.9; // smooth decay
      lastTop = top;

      // momentum skew — the strip leans as you scroll
      const targetSkew = Math.max(-12, Math.min(12, vel * -0.5));
      curSkew += (targetSkew - curSkew) * 0.15;
      if (Math.abs(curSkew) > 0.05) {
        skew.style.transform = `skewX(${curSkew.toFixed(2)}deg)`;
        writtenSkew = true;
      } else if (writtenSkew) {
        skew.style.transform = "";
        writtenSkew = false;
      }

      // velocity boost — hard reverse scrolling flips the drift direction
      let targetRate = 1 + Math.min(4, Math.abs(vel) * 0.12);
      if (vel < -8) targetRate = -targetRate;
      curRate += (targetRate - curRate) * 0.12;
      if (Math.abs(curRate - writtenRate) > 0.01) {
        writtenRate = curRate;
        for (const a of getAnims()) {
          try {
            a.playbackRate = curRate;
          } catch {
            /* engines without WAAPI on CSS animations — CSS keeps it moving */
          }
        }
      }

      // park when fully settled: no velocity, no residual skew/rate drift
      const settled =
        Math.abs(vel) < 0.05 && Math.abs(curSkew) < 0.06 && Math.abs(curRate - 1) < 0.012;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!isIntersecting) return;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    scroller.addEventListener("scroll", wake, { passive: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", wake);
      skew.style.transform = "";
      for (const a of getAnims()) {
        try {
          a.playbackRate = 1;
        } catch {
          /* noop */
        }
      }
    };
  }, [reverse, variant]);

  const isDisplay = variant === "display";
  const duration = isDisplay ? 34 : 20;

  const row = (key: string) => (
    <div key={key} className="flex items-center shrink-0">
      {items.map((item, i) =>
        isDisplay ? (
          <span key={i} className="flex items-center shrink-0">
            <span
              className={`font-extrabold type-xwide uppercase tracking-[-0.02em] leading-none text-[10vw] sm:text-[4.6vw] ${
                i % 2 === 1 ? "text-stroke-bone" : "text-bone"
              }`}
            >
              {item}
            </span>
            <span
              className="text-volt text-[5vw] sm:text-[2.2vw] mx-[4vw] sm:mx-[1.8vw]"
              aria-hidden="true"
            >
              ✦
            </span>
          </span>
        ) : (
          <span key={i} className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10 shrink-0">
            <span className="font-mono text-[10px] sm:text-[12px] font-bold tracking-[0.28em]">
              {item}
            </span>
            <span className="w-2 h-2 bg-void rotate-45" aria-hidden="true" />
          </span>
        )
      )}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden ${
        isDisplay
          ? "py-5 sm:py-7"
          : "border-b border-void/20 bg-volt text-void py-3.5"
      } ${className}`}
      aria-hidden="true"
    >
      {/* skew wrapper — JS owns the lean, CSS owns the loop */}
      <div ref={skewRef} className="will-change-transform">
        <div
          ref={trackRef}
          className="flex w-max will-change-transform animate-marquee"
          style={{
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}
