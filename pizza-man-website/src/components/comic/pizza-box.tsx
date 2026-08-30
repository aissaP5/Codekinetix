'use client'

import { useEffect, useRef } from 'react'
import { Bike, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import {
  Caption,
  ComicLink,
  HalftonePatch,
  Ono,
  Starburst,
} from '@/components/comic/primitives'
import { PizzaManLogo } from '@/components/comic/logo'

/* ============ Comic pizza (top view, static coords — hydration-safe) ============ */

export function PizzaArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn('block', className)} aria-hidden="true">
      {/* Crust */}
      <circle cx="100" cy="100" r="94" fill="#e8a33d" stroke="#141414" strokeWidth="6" />
      {/* Cheese */}
      <circle cx="100" cy="100" r="76" fill="#ffde59" stroke="#141414" strokeWidth="4.5" />
      {/* Slice cuts */}
      <g stroke="#141414" strokeWidth="2" opacity="0.35">
        <line x1="100" y1="26" x2="100" y2="174" />
        <line x1="35" y1="63" x2="165" y2="137" />
        <line x1="35" y1="137" x2="165" y2="63" />
      </g>
      {/* Pepperoni */}
      <g fill="#ef3e36" stroke="#141414" strokeWidth="3">
        <circle cx="100" cy="58" r="11" />
        <circle cx="135" cy="78" r="10" />
        <circle cx="142" cy="118" r="10.5" />
        <circle cx="112" cy="145" r="10" />
        <circle cx="72" cy="140" r="10.5" />
        <circle cx="58" cy="108" r="10" />
        <circle cx="66" cy="70" r="9.5" />
      </g>
      {/* Pepperoni speckles */}
      <g fill="#a3241d">
        <circle cx="97" cy="55" r="1.8" />
        <circle cx="104" cy="61" r="1.6" />
        <circle cx="132" cy="76" r="1.6" />
        <circle cx="139" cy="121" r="1.7" />
        <circle cx="109" cy="147" r="1.6" />
        <circle cx="69" cy="143" r="1.7" />
        <circle cx="55" cy="106" r="1.6" />
        <circle cx="63" cy="68" r="1.5" />
      </g>
      {/* Basil leaves */}
      <g fill="#2e9e4f" stroke="#141414" strokeWidth="2.5">
        <ellipse cx="86" cy="88" rx="7" ry="4.5" transform="rotate(-24 86 88)" />
        <ellipse cx="122" cy="102" rx="7" ry="4.5" transform="rotate(18 122 102)" />
        <ellipse cx="92" cy="126" rx="6.5" ry="4" transform="rotate(-40 92 126)" />
      </g>
      {/* Cheese shine */}
      <path
        d="M 52 62 A 62 62 0 0 1 96 40"
        fill="none"
        stroke="#fffdf2"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/* ============ Rising steam wisps ============ */

function SteamWisps({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none flex items-end justify-center gap-5', className)} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 44"
          className="h-11 w-6 animate-steam"
          style={{ animationDelay: `${-1.5 + i * 0.7}s` }}
          fill="none"
        >
          <path
            d="M12 42 C 6 34, 18 28, 12 20 C 7 13, 16 8, 12 2"
            stroke="#fffdf2"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      ))}
    </div>
  )
}

/* ============ Star burst confetti (static coords — hydration-safe) ============ */

const STARS = [
  { x: -130, y: -80, s: 22, rot: -12, fill: '#ffd100' },
  { x: 120, y: -95, s: 16, rot: 20, fill: '#fffdf2' },
  { x: -155, y: 15, s: 14, rot: 40, fill: '#00b8a9' },
  { x: 150, y: 25, s: 20, rot: -30, fill: '#ff5da2' },
  { x: -95, y: 105, s: 16, rot: 15, fill: '#fffdf2' },
  { x: 105, y: 115, s: 24, rot: -18, fill: '#ffd100' },
  { x: -10, y: -135, s: 14, rot: 30, fill: '#00b8a9' },
  { x: 15, y: 145, s: 15, rot: -40, fill: '#ff5da2' },
]

function Sparkle({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
        fill={fill}
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =================================================================
   REAL 3D BOX CONSTRUCTION (pure CSS 3D — no fake flat divs)
   -----------------------------------------------------------------
   Camera: the whole box group is tilted rotateX(54°) + yaw rotateZ(-14°),
   so we look INTO the box from above-front like a studio shot.

   Coordinates (Y points down in CSS 3D):
   · floor  — lies in the group plane at z = 0
   · walls  — hinged on the floor edges, folded UP toward the viewer (+Z)
   · lid    — floats at z = BOX_H, overhanging the base, with its own rim
              folded DOWN (-Z); hinged on its back edge (origin top)
   · pizza  — rests on the floor at z = 8, hidden by the closed lid

   The lid opens AWAY from the viewer (rotateX +114°) exactly like a
   real pizza box. Scroll (pinned + scrubbed) drives the whole story;
   tapping the box fast-forwards the scroll to the big reveal.
   ================================================================= */

const BOX_H = 46 // wall height / lid altitude in px

/* corrugated kraft wall — hinged on one floor edge, folded UP (+Z).
   Walls are positioned lying over the floor then rotated, so their printed
   face points OUTWARD (front-wall print reads correctly, never mirrored). */
function Wall({
  className,
  shade,
  fringeClass,
  verticalFringe,
  children,
}: {
  className: string
  shade: 'front' | 'back' | 'side'
  fringeClass: string
  verticalFringe?: boolean
  children?: React.ReactNode
}) {
  const bg =
    shade === 'front' ? '#e6cd97' : shade === 'back' ? '#e9d4a0' : '#dcbd82'
  return (
    <div
      aria-hidden
      className={cn('absolute overflow-hidden border-[3px] border-ink', className)}
      style={{ background: bg }}
    >
      {/* corrugation fringe along the edge that ends up on top */}
      <div
        className={cn('absolute opacity-60', fringeClass)}
        style={{
          backgroundImage: verticalFringe
            ? 'repeating-linear-gradient(0deg, rgba(20,20,20,0.16) 0 3px, transparent 3px 8px)'
            : 'repeating-linear-gradient(90deg, rgba(20,20,20,0.16) 0 3px, transparent 3px 8px)',
        }}
      />
      {children}
    </div>
  )
}

/* grease stain ring (printed on kraft) */
function GreaseRing({ className, size }: { className?: string; size: number }) {
  return (
    <span
      aria-hidden
      className={cn('absolute rounded-full', className)}
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle, transparent 52%, rgba(176,134,58,0.30) 60%, rgba(176,134,58,0.10) 72%, transparent 76%)',
      }}
    />
  )
}

/* =================================================================
   UNBOX SCENE
   ================================================================= */

export function UnboxScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null) // mouse-tilt layer
  const bobRef = useRef<HTMLDivElement>(null) // idle float layer
  const lidRef = useRef<HTMLDivElement>(null)
  const pizzaRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const steamRef = useRef<HTMLDivElement>(null)
  const tadaRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const hudChipRef = useRef<HTMLParagraphElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const chevronRef = useRef<SVGSVGElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)

  // Safety net: if the entrance tween never fires (frozen rAF, extensions…),
  // force the scene visible after 5s.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = wrapRef.current
      if (el) {
        el.style.opacity = '1'
        el.style.visibility = 'visible'
      }
    }, 5000)
    return () => window.clearTimeout(t)
  }, [])

  useGSAP(
    () => {
      // Entrance (one-shot when the scene scrolls into view). Animated on the
      // INNER column — never on the pinned wrap itself — so a fast scroll that
      // triggers the entrance and the pin at the same time can't jump.
      gsap.from('.unbox-col', {
        y: 90,
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 92%', once: true },
      })

      // Idle float — the box breathes even before you scroll
      gsap.to(bobRef.current, { y: -9, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      // Pinned, scrubbed unboxing story
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 96px',
          end: '+=125%',
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            stRef.current = self
            const el = labelRef.current
            if (el && self.progress > 0.82 && el.dataset.state !== 'open') {
              el.dataset.state = 'open'
              el.textContent = 'UNBOXED! DELICIOUS.'
              gsap.fromTo(el, { scale: 1.18, rotation: 2 }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(3)' })
            } else if (el && self.progress < 0.8 && el.dataset.state === 'open') {
              // scrolling back up: reset the invite so the story can replay
              el.dataset.state = 'closed'
              el.textContent = 'Scroll to unbox'
            }
          },
        },
      })

      // 1 — the lid swings open, away from you (majestic hinge on the back edge)
      tl.fromTo(
        lidRef.current,
        { rotationX: 0 },
        { rotationX: 114, duration: 5.4, ease: 'power1.inOut' },
        0.5
      )
        // ground shadow tightens as the box "opens up"
        .to(shadowRef.current, { scale: 0.84, opacity: 0.6, duration: 4.6 }, 0.8)
        // 2 — the pizza settles upward out of the box
        .fromTo(
          pizzaRef.current,
          { z: 8, scale: 0.94 },
          { z: 22, scale: 1.05, duration: 2.6, ease: 'back.out(1.6)' },
          4.4
        )
        // 3 — steam starts rising
        .fromTo(steamRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.6 }, 5.4)
        // 4 — TA-DAA! explosion
        .fromTo(
          tadaRef.current,
          { scale: 0, rotation: -24 },
          { scale: 1, rotation: -6, duration: 1.5, ease: 'back.out(2.4)' },
          6.4
        )
        // 5 — Pizza-Man speaks
        .fromTo(
          bubbleRef.current,
          { scale: 0 },
          { scale: 1, duration: 1.1, ease: 'back.out(2)' },
          7.0
        )
        // 5b — the HUD chip bows out once its "UNBOXED!" beat has landed…
        .to(
          hudChipRef.current,
          { autoAlpha: 0, scale: 0.7, y: -6, duration: 0.8, ease: 'power2.in' },
          8.7
        )
        // 5c — …and the ORDER NOW! punchline SLAPS across the open box
        // (big sticker, dead-center of the scene, straddling the box edge)
        .fromTo(
          ctaRef.current,
          { scale: 0, rotation: -18, autoAlpha: 0 },
          { scale: 1, rotation: -5, autoAlpha: 1, duration: 1.1, ease: 'back.out(2.2)' },
          8.8
        )
        // 5d — landing squash: the sticker really hits the cardboard
        .to(ctaRef.current, { scale: 1.08, duration: 0.4, ease: 'power2.out' }, 9.95)
        .to(ctaRef.current, { scale: 1, duration: 0.35, ease: 'power2.in' }, 10.35)

      // 6 — confetti stars burst outward, then fade
      gsap.utils.toArray<HTMLElement>('.unbox-star').forEach((star, i) => {
        const d = STARS[i % STARS.length]
        tl.fromTo(
          star,
          { x: 0, y: 0, scale: 0, opacity: 0 },
          { x: d.x, y: d.y, scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          6.8 + i * 0.06
        ).to(star, { opacity: 0, scale: 0.5, duration: 1.4 }, 8.4)
      })

      // 7 — the chevron cue bows out once the lid starts moving
      tl.to(chevronRef.current, { autoAlpha: 0, duration: 0.8 }, 1.6)
    },
    { scope: wrapRef }
  )

  useGSAP(
    () => {
      /* ---------- Mouse tilt (desktop only): the box leans toward you ---------- */
      const mq = gsap.matchMedia()
      mq.add('(pointer: fine)', () => {
        const rx = gsap.quickTo(sceneRef.current, 'rotationX', { duration: 0.9, ease: 'power3' })
        const ry = gsap.quickTo(sceneRef.current, 'rotationY', { duration: 0.9, ease: 'power3' })
        const onMove = (e: MouseEvent) => {
          const cx = e.clientX / window.innerWidth - 0.5
          const cy = e.clientY / window.innerHeight - 0.5
          ry(cx * 10)
          rx(-cy * 5)
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
      })
    },
    { scope: wrapRef }
  )

  return (
    <div
      ref={wrapRef}
      className="relative flex min-h-[calc(100svh-110px)] flex-col items-center justify-center py-4"
    >
      {/* The scene sits below center on purpose: when the lid swings open it
          sweeps ~2 scene-heights upward — this offset keeps it clear of the
          fixed navbar instead of clipped behind it, and kills the dead zone
          under the HUD. */}
      <div
        className={cn(
          'unbox-col relative w-full max-w-[23rem] select-none translate-y-[7.5rem] px-2 sm:max-w-[27rem] sm:translate-y-[8.75rem]',
          className
        )}
      >
        {/* ---------- STAGE DISC (screen space, behind everything) ---------- */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[47%] aspect-square w-[min(108%,21rem)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(112%,25rem)]"
        >
          <div className="absolute inset-0 rounded-full border-4 border-ink bg-pulp shadow-comic-xl" />
          <div className="absolute inset-3 rounded-full border-[3px] border-dashed border-ink/35" />
          <div className="halftone absolute inset-0 rounded-full text-ink/[0.07]" />
          <span className="absolute left-[13%] top-[28%] h-5 w-5 rotate-12">
            <Sparkle fill="#ffd100" />
          </span>
          <span className="absolute right-[11%] top-[60%] h-4 w-4 -rotate-6">
            <Sparkle fill="#00b8a9" />
          </span>
        </div>

        {/* ---------- GROUND SHADOW (screen space) ---------- */}
        <div aria-hidden className="absolute left-1/2 top-[76%] z-[1] w-[80%] -translate-x-1/2">
          <div
            ref={shadowRef}
            className="h-9 w-full rounded-[50%] blur-[3px]"
            style={{
              background: 'radial-gradient(closest-side, rgba(20,20,20,0.42), rgba(20,20,20,0))',
            }}
          />
        </div>

        {/* ---------- 3D SCENE (tap = fast-forward the unboxing) ---------- */}
        <button
          type="button"
          aria-label="Pizza box — tap to reveal it instantly, or keep scrolling to unbox"
          onClick={() => {
            const st = stRef.current
            gsap.fromTo(
              bobRef.current,
              { scale: 0.97 },
              { scale: 1, duration: 0.45, ease: 'back.out(3)', clearProps: 'scale' }
            )
            if (st && st.progress < 0.8) {
              window.scrollTo({ top: st.start + (st.end - st.start) * 0.99, behavior: 'smooth' })
            }
          }}
          className="relative z-[2] mt-2 block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-comic-yellow/90"
          style={{ perspective: '1300px' }}
        >
          <div ref={sceneRef} className="w-full" style={{ transformStyle: 'preserve-3d' }}>
            <div ref={bobRef} className="w-full" style={{ transformStyle: 'preserve-3d' }}>
              {/* CAMERA TILT — studio shot from above-front, slight yaw */}
              <div
                className="relative mx-auto aspect-square w-[78%] sm:w-[82%]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(54deg) rotateZ(-14deg)',
                }}
              >
                {/* INTERIOR FLOOR (bottom of the box) */}
                <div
                  className="absolute inset-0 overflow-hidden border-[3.5px] border-ink bg-[#f6ead0]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="halftone absolute inset-0 text-ink/10" />
                  <GreaseRing className="-left-2 -top-2" size={74} />
                  <GreaseRing className="-bottom-3 right-2" size={92} />
                  <GreaseRing className="left-[38%] top-[30%]" size={48} />
                </div>

                {/* WALLS — lying on the floor, folded UP around their outer edge.
                    Fringe sits on the edge that ends up at the top after folding. */}
                <Wall shade="back" fringeClass="inset-x-0 bottom-0" className="inset-x-0 top-0 h-[46px] origin-top [transform:rotateX(90deg)]" />
                <Wall shade="front" fringeClass="inset-x-0 top-0" className="inset-x-0 bottom-0 h-[46px] origin-bottom [transform:rotateX(-90deg)]">
                  {/* the printed strip says hi (reads correctly from outside) */}
                  <div className="absolute inset-x-0 bottom-0 top-[7px] flex items-center justify-center">
                    <p className="font-display text-[10px] uppercase tracking-[0.28em] text-comic-red">
                      • Pizza-Man! • Hot &amp; Fresh •
                    </p>
                  </div>
                </Wall>
                <Wall shade="side" fringeClass="inset-y-0 right-0" verticalFringe className="bottom-0 left-0 top-0 w-[46px] origin-left [transform:rotateY(-90deg)]" />
                <Wall shade="side" fringeClass="inset-y-0 left-0" verticalFringe className="bottom-0 right-0 top-0 w-[46px] origin-right [transform:rotateY(90deg)]" />

                {/* THE PIZZA — rests inside, pops up while scrolling, spins forever.
                    The drop-shadow lives on this wrapper (NOT the spinner) so the
                    shadow stays put while the pizza rotates. */}
                <div
                  ref={pizzaRef}
                  className="absolute inset-[9%] drop-shadow-[0_9px_0_rgba(20,20,20,0.28)]"
                  style={{ transform: 'translateZ(8px) scale(0.94)' }}
                >
                  <div className="animate-spin-slower h-full w-full">
                    <PizzaArt className="h-full w-full" />
                  </div>
                </div>

                {/* LID — overhangs the base, hinged on its back edge */}
                <div
                  ref={lidRef}
                  className="absolute -inset-[3%]"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${BOX_H}px)`,
                    transformOrigin: '50% 0%',
                    willChange: 'transform',
                  }}
                >
                  {/* lid rim — folded down around the lid edge */}
                  <div aria-hidden className="absolute inset-x-0 top-full h-[12px] origin-top border-[3px] border-ink bg-[#c22b22]" style={{ transform: 'rotateX(-90deg)' }} />
                  <div aria-hidden className="absolute inset-x-0 bottom-full h-[12px] origin-bottom border-[3px] border-ink bg-[#a8241d]" style={{ transform: 'rotateX(90deg)' }} />
                  <div aria-hidden className="absolute bottom-0 right-full top-0 w-[12px] origin-right border-[3px] border-ink bg-[#b0271f]" style={{ transform: 'rotateY(-90deg)' }} />
                  <div aria-hidden className="absolute bottom-0 left-full top-0 w-[12px] origin-left border-[3px] border-ink bg-[#b0271f]" style={{ transform: 'rotateY(90deg)' }} />

                  {/* LID UNDERSIDE (visible once open) */}
                  <div
                    className="absolute inset-0 overflow-hidden border-[3.5px] border-ink bg-[#efdcb4]"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                  >
                    <div className="halftone absolute inset-0 text-ink/10" />
                    <GreaseRing className="left-[6%] top-[10%]" size={80} />
                    <GreaseRing className="bottom-[8%] right-[5%]" size={64} />
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                      <p className="comic-title -rotate-6 text-2xl uppercase text-ink/75 sm:text-3xl">
                        Fresh &amp; hot!
                      </p>
                      <span className="-rotate-1 border-2 border-ink bg-comic-yellow px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.2em] text-ink sm:text-[10px]">
                        100% hero-grade pizza
                      </span>
                    </div>
                  </div>

                  {/* LID TOP — the printed face you see when closed */}
                  <div
                    className="absolute inset-0 overflow-hidden border-[3.5px] border-ink bg-comic-red shadow-comic-lg"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div aria-hidden className="halftone-lg absolute inset-0 text-ink/15" />
                    {/* print frame */}
                    <div aria-hidden className="absolute inset-[5.5%] border-[3px] border-dashed border-comic-yellow/80" />
                    {/* soft light sheen */}
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(155deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 34%, transparent 55%)',
                      }}
                    />
                    {/* tape strips crossing the corners */}
                    <div
                      aria-hidden
                      className="absolute -left-7 -top-4 h-7 w-24 -rotate-45 border-2 border-ink/50 bg-comic-yellow/90"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(-45deg, rgba(20,20,20,0.18) 0 5px, transparent 5px 11px)',
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-4 -right-7 h-7 w-24 -rotate-45 border-2 border-ink/50 bg-comic-yellow/90"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(-45deg, rgba(20,20,20,0.18) 0 5px, transparent 5px 11px)',
                      }}
                    />

                    {/* printed branding */}
                    <div className="relative flex h-full flex-col items-center justify-center gap-1.5 pb-[4%] pt-[6%]">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-5 text-pulp sm:-inset-6">
                          <Starburst stretch className="h-full w-full" />
                        </div>
                        <PizzaManLogo className="relative h-14 w-14 drop-shadow-[3px_3px_0_var(--color-ink)] sm:h-16 sm:w-16" />
                      </div>
                      <p
                        className="comic-title text-2xl uppercase text-comic-yellow sm:text-3xl"
                        style={{ textShadow: '3px 3px 0 var(--color-ink)' }}
                      >
                        Pizza-Man<span className="text-pulp">!</span>
                      </p>
                      <span className="rotate-[-1.5deg] border-2 border-ink bg-comic-yellow px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.18em] text-ink shadow-comic-sm sm:text-[10px]">
                        Hot &amp; fresh in 20 min
                      </span>
                    </div>

                    {/* caution small print */}
                    <p className="absolute inset-x-0 bottom-[7.5%] text-center font-display text-[7px] uppercase tracking-[0.3em] text-pulp/85 sm:text-[8px]">
                      Caution: contents are delicious
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Steam (revealed by scroll, screen space — rises from the open box) */}
        <div ref={steamRef} style={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-[7%] z-30 -translate-x-1/2">
          <SteamWisps />
        </div>

        {/* Scroll-to-unbox HUD — the chip narrates the story, then bows out */}
        <div className="relative z-20 mt-5 flex justify-center">
          <p
            ref={hudChipRef}
            className="flex -rotate-1 items-center gap-2 border-[3px] border-ink bg-comic-yellow px-4 py-2 font-display text-sm uppercase tracking-widest text-ink shadow-comic"
          >
            <span ref={labelRef} data-state="closed">
              Scroll to unbox
            </span>
            <ChevronDown ref={chevronRef} className="h-4 w-4 animate-bob" aria-hidden="true" />
          </p>
        </div>

        {/* ORDER NOW! punchline — a big comic sticker SLAPPED across the open
            box, dead-center of the scene (straddling the box bottom edge).
            The starburst lives INSIDE the link → the whole badge is one huge
            hit target; the wrapper centers/positions, GSAP only animates the
            inner ctaRef (never the same element as a CSS translate). */}
        <div className="pointer-events-none absolute inset-x-0 top-[79%] z-30 flex -translate-y-1/2 justify-center">
          <div
            ref={ctaRef}
            style={{ transform: 'scale(0)', opacity: 0, visibility: 'hidden' }}
            className="pointer-events-auto"
          >
            <div className="animate-bob">
              <ComicLink
                href="/menu"
                color="red"
                aria-label="Order now — open the menu"
                className="relative px-6 py-3 text-xl shadow-comic sm:px-8 sm:py-4 sm:text-2xl"
              >
                <span aria-hidden className="absolute -inset-4 -z-10 text-comic-yellow sm:-inset-5">
                  <Starburst stretch className="h-full w-full" />
                </span>
                <Bike className="h-6 w-6" /> Order now!
              </ComicLink>
            </div>
          </div>
        </div>

        {/* Confetti star burst */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
          {STARS.map((d, i) => (
            <span
              key={i}
              className="unbox-star absolute left-1/2 top-[46%] block"
              style={{
                width: d.s,
                height: d.s,
                opacity: 0,
                transform: `rotate(${d.rot}deg)`,
              }}
            >
              <Sparkle fill={d.fill} />
            </span>
          ))}
        </div>

        {/* TA-DAA! explosion */}
        <div
          ref={tadaRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 left-2 z-30 sm:-left-2"
          style={{ transform: 'scale(0)' }}
        >
          <div className="relative">
            <div className="absolute -inset-3 -z-10 text-comic-yellow sm:-inset-6">
              <Starburst stretch className="h-full w-full" />
            </div>
            <span
              className="comic-title block whitespace-nowrap text-2xl text-comic-red sm:text-4xl"
              style={{ textShadow: '4px 4px 0 var(--color-ink)' }}
            >
              TA-DAA!
            </span>
          </div>
        </div>

        {/* Pizza-Man speaks at the reveal */}
        <div
          ref={bubbleRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-14 right-0 z-30 rotate-6 sm:-right-2"
          style={{ transform: 'scale(0)' }}
        >
          <div className="relative rounded-[1.6rem] border-[4px] border-ink bg-pulp px-5 py-3 shadow-comic">
            <p className="comic-title-sm text-lg text-ink sm:text-xl">Fresh outta the oven!</p>
            <span
              aria-hidden
              className="absolute -bottom-3 left-10 h-5 w-5 rotate-45 border-b-[4px] border-r-[4px] border-ink bg-pulp"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* =================================================================
   UNBOX TRANSITION — its own comic chapter between the story
   panels and the menu. Caption boxes + onomatopoeias dress the
   scene; the pinned scroll-driven box does the talking.
   ================================================================= */

export function UnboxTransition() {
  return (
    <section
      id="unbox"
      aria-label="Scroll to unbox your pizza"
      className="relative scroll-mt-24 overflow-hidden border-y-[5px] border-ink bg-paper py-8 md:py-10"
    >
      <HalftonePatch className="halftone-lg left-[4%] top-16 h-44 w-44 rounded-full text-comic-red/15" />
      <HalftonePatch className="halftone-lg bottom-16 right-[5%] h-40 w-40 rounded-full text-comic-purple/15" />
      <div aria-hidden className="speed-lines absolute inset-x-0 top-0 h-28 text-ink/[0.06]" />

      {/* Comic narration captions — the punchline lives on the LEFT on mobile
          so the fixed back-to-top button never covers it; on desktop it docks
          left of the button (right-36 > button right-10 + width) */}
      <Caption className="left-4 top-5 hidden sm:left-8 sm:block">Meanwhile, at the pizzeria&hellip;</Caption>
      <Caption className="bottom-7 left-4 rotate-1 sm:left-auto sm:right-36">To be continued&hellip; in the menu</Caption>

      <Ono
        word="GASP!"
        size="text-4xl"
        burstColor="text-comic-yellow"
        textClass="text-comic-purple"
        className="left-1 top-[40%] hidden lg:block sm:left-8"
      />
      <Ono
        word="MMM!"
        size="text-3xl"
        burstColor="text-comic-pink"
        textClass="text-ink"
        className="right-1 top-[7%] hidden lg:block sm:right-8"
      />

      <UnboxScene />
    </section>
  )
}
