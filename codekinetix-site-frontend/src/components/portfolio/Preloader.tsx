"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { curtain } from "@/lib/curtain";

/**
 * BOOT — the CK monogram on a live calibration stage.
 *
 * The mark lands with a springy overshoot, viewfinder brackets snap
 * in around it, and it never sits still: a gentle float, a breathing
 * volt aura, two glitch beats, and a scanner sheet that sweeps the
 * mark top-to-bottom right before the handoff. Underneath, the
 * counter climbs 000-100 while a glow head travels the progress
 * line and a status line cycles INITIALIZING → LOADING ASSETS →
 * MOTION SYSTEMS → READY. Then the mark scales INTO the reveal and
 * dissolves — handing off to the particle logo forming in the hero
 * as the curtain lifts.
 *
 * R33 — the boot is on the CURTAIN BUS: cover() at mount tells the
 * particle engine (and anything else that listens) that the screen
 * is hidden, so the hero field builds UNDER the boot at zero visual
 * cost and its held entrance clock releases the moment this curtain
 * starts to lift — the handoff is seamless and the reveal frame
 * carries zero build work. The whole timeline is also ~0.65× —
 * owner: "too slow to start" — every beat survives, tighter.
 *
 * R34 — SESSION-ADAPTIVE BOOT: the FULL calibration show plays for a
 * visitor's FIRST load of the session; a refresh / same-session
 * return gets the same beats on a ~0.55× clock (fast systems-check:
 * spring-land → brackets → counter rip → glitch → scanner flick →
 * handoff → lift ≈ 1.0s). The owner refreshes constantly — "optimize
 * the load and refrech time, it is too slow" — so the repeat path is
 * the fast one, while new arrivals still get the full boot piece.
 * (New tab = full show; the flag lives in sessionStorage.)
 *
 * No log text, no terminal — the mark IS the boot.
 */
const BOOT_KEY = "ck-boot"; // shared with ParticleWord's boot() defer
const bootSeen = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false;
  }
};

/* Every beat position in one table — the FULL show (first visit) and
   the FAST pass (refresh) share the exact same structure; only the
   clock differs. dur = tween duration, pos = timeline position. */
const T_FULL = {
  gridDur: 0.45,
  metaPos: 0.04,
  metaDur: 0.35,
  botPos: 0.1,
  botDur: 0.4,
  logoPos: 0.08,
  logoDur: 0.6,
  glowPos: 0.2,
  glowDur: 0.4,
  tickPos: 0.34,
  tickDur: 0.3,
  tickStag: 0.04,
  ctrPos: 0.26,
  ctrDur: 0.75,
  glitch1: 0.6,
  glitch2: 0.86,
  headDiePos: 1.0,
  headDieDur: 0.16,
  scanPos: 0.98,
  scanDur: 0.3,
  handoffPos: 1.1,
  handoffDur: 0.34,
  liftPos: 1.28,
  liftDur: 0.5,
  loopDelay: 0.6,
};
const T_FAST = {
  gridDur: 0.18,
  metaPos: 0.02,
  metaDur: 0.22,
  botPos: 0.06,
  botDur: 0.26,
  logoPos: 0.02,
  logoDur: 0.34,
  glowPos: 0.12,
  glowDur: 0.22,
  tickPos: 0.2,
  tickDur: 0.2,
  tickStag: 0.03,
  ctrPos: 0.14,
  ctrDur: 0.34,
  glitch1: 0.4,
  glitch2: -1, // one stutter is enough on the fast pass
  headDiePos: 0.46,
  headDieDur: 0.1,
  scanPos: 0.38,
  scanDur: 0.18,
  handoffPos: 0.52,
  handoffDur: 0.22,
  liftPos: 0.66,
  liftDur: 0.36,
  loopDelay: 0.3,
};
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const booted = useKinetix((s) => s.booted);
  // R33 — curtain balance (same pattern as PageTransition)
  const coveredRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // R34 — which clock? First load of the session = the FULL show;
    // mark it seen so any refresh / same-session return runs FAST.
    const FAST = bootSeen();
    const T = FAST ? T_FAST : T_FULL;
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* private mode — the full show every time, harmless */
    }
    // R33 — announce the cover for the whole boot window: the hero
    // particle field builds under it and HOLDS its entrance clock.
    curtain.cover();
    coveredRef.current = true;
    const ctx = gsap.context(() => {
      /* status line — swaps as the counter climbs, with a flicker */
      const STATUSES = [
        { at: 0, label: "INITIALIZING" },
        { at: 34, label: "LOADING ASSETS" },
        { at: 68, label: "MOTION SYSTEMS" },
        { at: 100, label: "READY" },
      ];
      const setStatus = (v: number) => {
        let label = STATUSES[0].label;
        for (const s of STATUSES) if (v >= s.at) label = s.label;
        const el = statusRef.current;
        if (el && el.textContent !== label) {
          el.textContent = label;
          gsap.fromTo(
            el,
            { opacity: 0.15 },
            { opacity: 1, duration: 0.22, ease: "power1.out" }
          );
        }
      };

      const counter = { v: 0 };
      const tl = gsap.timeline();

      tl
        /* initial states */
        .set(".pl-line", { scaleX: 0 })
        .set(".pl-head", { left: "0%", opacity: 0 })
        .set(".pl-glow", { opacity: 0 })
        .set(".pl-grid", { opacity: 0 })
        .set(".pl-tick", { scale: 0, opacity: 0 })
        /* faint technical grid fades up behind everything */
        .to(".pl-grid", { opacity: 1, duration: T.gridDur, ease: "none" }, 0)
        /* meta rows slide in from their edges */
        .fromTo(
          ".pl-meta-l",
          { x: -26, opacity: 0 },
          { x: 0, opacity: 1, duration: T.metaDur, ease: "power3.out" },
          T.metaPos
        )
        .fromTo(
          ".pl-meta-r",
          { x: 26, opacity: 0 },
          { x: 0, opacity: 1, duration: T.metaDur, ease: "power3.out" },
          T.metaPos
        )
        /* bottom row rises in */
        .fromTo(
          ".pl-bot",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: T.botDur, ease: "power3.out" },
          T.botPos
        )
        /* the monogram lands — springy overshoot + rotation settle */
        .fromTo(
          ".pl-logo",
          { opacity: 0, scale: 0.6, y: -46, rotation: -5 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: T.logoDur,
            ease: "back.out(1.4)",
          },
          T.logoPos
        )
        /* volt aura fades up behind it */
        .to(".pl-glow", { opacity: 1, duration: T.glowDur, ease: "power2.out" }, T.glowPos)
        /* viewfinder brackets snap in around the mark */
        .to(
          ".pl-tick",
          {
            scale: 1,
            opacity: 1,
            duration: T.tickDur,
            stagger: T.tickStag,
            ease: "back.out(2.2)",
          },
          T.tickPos
        )
        /* counter + progress line + traveling glow head */
        .to(".pl-head", { opacity: 1, duration: 0.12 }, T.ctrPos)
        .to(".pl-head", { left: "100%", duration: T.ctrDur, ease: "power2.inOut" }, T.ctrPos)
        .to(".pl-line", { scaleX: 1, duration: T.ctrDur, ease: "power2.inOut" }, T.ctrPos)
        .to(
          counter,
          {
            v: 100,
            duration: T.ctrDur,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(
                  Math.round(counter.v)
                ).padStart(3, "0");
              }
              setStatus(counter.v);
            },
          },
          T.ctrPos
        )
        /* glitch beat — the mark stutters while loading */
        .to(
          ".pl-logo-wrap",
          { opacity: 0.25, x: 7, duration: 0.05, repeat: 1, yoyo: true },
          T.glitch1
        )
        /* glow head dies at 100 */
        .to(".pl-head", { opacity: 0, duration: T.headDieDur }, T.headDiePos)
        /* scanner pass — a volt sheet sweeps the mark top → bottom
           (clear of the handoff fade so it stays bright for its sweep) */
        .fromTo(
          ".pl-scan",
          { yPercent: -130, opacity: 0.9 },
          { yPercent: 130, opacity: 0, duration: T.scanDur, ease: "power2.inOut" },
          T.scanPos
        )
        /* the mark hands off — scales INTO the reveal and dissolves */
        .to(
          ".pl-logo-wrap",
          { scale: 1.07, opacity: 0, duration: T.handoffDur, ease: "power2.in" },
          T.handoffPos
        )
        /* curtain lifts — the hero particle logo forms DURING the wipe.
           R33: the lift START uncovers the curtain bus — the held hero
           choreography releases right here, exactly as the mark hands
           off — and flips the store's phase in the same beat. */
        .to(
          rootRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: T.liftDur,
            ease: "power4.inOut",
            onStart: () => {
              curtain.uncover();
              coveredRef.current = false;
              booted("about");
            },
          },
          T.liftPos
        )
        .set(rootRef.current, { display: "none" });

      /* second stutter — FULL show only (glitch2 < 0 skips it: the
         fast pass keeps exactly one beat, no mash) */
      if (T.glitch2 >= 0) {
        tl.to(
          ".pl-logo-wrap",
          { opacity: 0.3, x: -6, duration: 0.05, repeat: 1, yoyo: true },
          T.glitch2
        );
      }

      /* infinite loops — kept OUTSIDE the timeline (an infinite repeat
         inside a timeline breaks the positions of the tweens after it) */
      /* glow breathing — subtle volt pulse behind the monogram */
      gsap.to(".pl-glow", {
        scale: 1.12,
        opacity: 0.65,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: T.glowPos + T.loopDelay,
      });
      /* the mark never sits still — gentle bob + micro-tilt */
      gsap.to(".pl-logo", {
        y: 9,
        rotation: 1.1,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: T.logoPos + T.loopDelay,
      });
    }, rootRef);

    return () => {
      // R33 — never strand the curtain: if the effect is torn down
      // before the lift (HMR / fast refresh in dev), rebalance.
      if (coveredRef.current) {
        curtain.uncover();
        coveredRef.current = false;
      }
      ctx.revert();
    };
  }, [booted]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-void px-4 sm:px-8 py-6"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden="true"
    >
      {/* faint technical grid backdrop — fades up with the boot */}
      <div
        className="pl-grid absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(58,111,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,111,255,0.055) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* top meta row */}
      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-bone/40">
        <span className="pl-meta-l">FREELANCE WEB STUDIO</span>
        <span className="pl-meta-r">EST. 2021</span>
      </div>

      {/* center — the CK monogram on its calibration stage.
           w-fit + mx-auto: the wrap shrinks to the mark so the glow
           hugs it and the whole thing sits dead-center. */}
      <div className="pl-logo-wrap relative w-fit mx-auto">
        <div
          className="pl-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[190%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(58,111,255,0.34), rgba(58,111,255,0.10) 55%, transparent 75%)",
          }}
          aria-hidden="true"
        />
        <img
          src="/ck-logo.webp"
          alt=""
          width={1000}
          height={562}
          draggable={false}
          className="pl-logo relative block w-[min(64vw,36vh)] sm:w-[min(44vw,62vh)] max-w-[560px] h-auto select-none pointer-events-none"
        />
        {/* scanner sheet — sweeps the mark before the handoff */}
        <div
          className="pl-scan absolute left-0 right-0 top-0 h-[22%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(58, 111, 255, 0) 35%, rgba(58, 111, 255, 0.4) 48%, rgba(58, 111, 255, 1) 50%, rgba(58, 111, 255, 0.4) 52%, rgba(58, 111, 255, 0) 65%)",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        />
        {/* viewfinder brackets — snap in around the mark */}
        <span className="pl-tick absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-volt" />
        <span className="pl-tick absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-volt" />
        <span className="pl-tick absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-volt" />
        <span className="pl-tick absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-volt" />
      </div>

      {/* bottom row: status, counter, progress line */}
      <div className="pl-bot relative">
        <div className="flex items-end justify-between mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-bone/40">
            <span ref={statusRef}>INITIALIZING</span>
          </span>
          <span className="font-mono text-4xl sm:text-5xl text-bone leading-none tabular-nums">
            <span ref={countRef}>000</span>
            <span className="text-volt">%</span>
          </span>
        </div>
        <div className="h-[3px] w-full bg-bone/15 relative">
          <div className="pl-line absolute inset-0 origin-left bg-volt shadow-[0_0_10px_rgba(58,111,255,0.5)]" />
          {/* glow head — travels the line with the counter */}
          <div
            className="pl-head absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9DB8FF] shadow-[0_0_12px_3px_rgba(58,111,255,0.85)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
