'use client'

import { useId, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Bike, Menu, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import {
  ComicLink,
  HalftonePatch,
  Magnetic,
  Ono,
  SpeechBubble,
  Starburst,
} from '@/components/comic/primitives'
import { CartButton } from '@/components/comic/cart'

const NAV_LINKS = [
  { href: '/menu', label: 'The Menu' },
  { href: '/#how', label: 'How It Works' },
  { href: '/#find-us', label: 'Find Us' },
]

/* ==================== NAVBAR ==================== */

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-6xl">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between border-[4px] border-ink bg-pulp py-2 pl-3 pr-2 shadow-comic sm:pl-4"
        >
          <a href="/" className="group flex items-center gap-2.5" aria-label="Pizza-Man! — back to top">
            <Image
              src="/comic/logo-mark.png"
              alt=""
              width={677}
              height={544}
              priority
              className="h-12 w-auto rotate-3 drop-shadow-[3px_3px_0_var(--color-ink)] transition-transform group-hover:animate-wiggle sm:h-14"
            />
            <span className="comic-title text-2xl text-ink sm:text-3xl">
              Pizza-Man<span className="text-comic-red">!</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-block px-4 py-2 font-display text-base uppercase tracking-wide text-ink transition-all hover:-rotate-2 hover:bg-comic-yellow/70"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CartButton />
            <ComicLink href="/menu" color="red" className="hidden px-5 py-2.5 text-base sm:inline-flex">
              <Bike className="h-5 w-5" /> Order now
            </ComicLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center border-[3px] border-ink bg-comic-red text-pulp shadow-comic-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.45 }}
              className="absolute inset-x-0 top-[calc(100%+10px)] z-50 border-[4px] border-ink bg-pulp p-4 shadow-comic-lg lg:hidden"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 font-display text-xl uppercase tracking-wide text-ink transition-colors hover:bg-comic-yellow/70"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <ComicLink href="/menu" color="red" className="w-full" onClick={() => setOpen(false)}>
                    <Bike className="h-5 w-5" /> Order now
                  </ComicLink>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

/* ==================== FLOATING INGREDIENTS (decor, parallax-ready) ==================== */

const INGREDIENTS = [
  {
    name: 'tomato',
    svg: (
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <circle cx="24" cy="27" r="17" fill="#ef3e36" stroke="#141414" strokeWidth="3" />
        <path d="M24 10 c-2 -4 -6 -5 -9 -4 c3 1 4 3 4 5" fill="#2e9e4f" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 10 c2 -4 6 -5 9 -4 c-3 1 -4 3 -4 5" fill="#2e9e4f" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 9 l0 6" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    className: 'left-[3%] top-[9%] h-14 w-14 -rotate-12 lg:left-[5%]',
    depth: 26,
    anim: 'animate-bob',
  },
  {
    name: 'pepperoni',
    svg: (
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="#ef3e36" stroke="#141414" strokeWidth="3" />
        <circle cx="24" cy="24" r="13" fill="#d13026" />
        <circle cx="19" cy="20" r="2.2" fill="#a3241d" />
        <circle cx="28" cy="26" r="2.4" fill="#a3241d" />
        <circle cx="21" cy="29" r="1.8" fill="#a3241d" />
      </svg>
    ),
    className: 'right-[3%] top-[7%] h-12 w-12 rotate-6 lg:right-[5%]',
    depth: -34,
    anim: 'animate-bob-slow',
  },
  {
    name: 'basil',
    svg: (
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <path d="M24 4 C 38 12, 40 30, 24 44 C 8 30, 10 12, 24 4 Z" fill="#2e9e4f" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <path d="M24 8 L 24 40" stroke="#141414" strokeWidth="2" opacity=".5" />
      </svg>
    ),
    className: 'left-[2.5%] top-[52%] h-12 w-12 rotate-12 lg:left-[4%]',
    depth: -22,
    anim: 'animate-bob-slow',
  },
  {
    name: 'cheese',
    svg: (
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="6" fill="#ffde59" stroke="#141414" strokeWidth="3" />
        <circle cx="17" cy="20" r="3.4" fill="#e8a33d" stroke="#141414" strokeWidth="2" />
        <circle cx="30" cy="28" r="4" fill="#e8a33d" stroke="#141414" strokeWidth="2" />
      </svg>
    ),
    className: 'right-[2.5%] top-[45%] h-14 w-14 -rotate-6 lg:right-[4%]',
    depth: 30,
    anim: 'animate-bob',
  },
  {
    name: 'chili',
    svg: (
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <path d="M12 40 C 8 32, 16 20, 30 16 L 34 20 C 24 28, 20 36, 16 41 C 15 42, 13 42, 12 40 Z" fill="#ef3e36" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 15 c1 -4 4 -6 8 -6 c-2 3 -2 5 -1 7" fill="#2e9e4f" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
    className: 'bottom-[10%] left-[3.5%] hidden h-12 w-12 rotate-45 lg:block',
    depth: -28,
    anim: 'animate-bob-slow',
  },
]

/* ==================== ROTATING CIRCULAR STAMP ==================== */
/* Classic comic-cover corner stamp: a ROUND badge whose ring text spins
   forever while the center ("20 MIN. FLAT!") stays readable. Pure SVG —
   crisp at any size, and emphatically NOT a square poster. */

function RotatingStamp({ className }: { className?: string }) {
  const id = useId()

  return (
    <div className={cn('pointer-events-none absolute z-30', className)} aria-hidden="true">
      <div className="hero-stamp relative aspect-square h-full w-full">
        {/* Static badge body + hard ink offset shadow */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full drop-shadow-[5px_5px_0_rgba(20,20,20,0.9)]"
        >
          <circle cx="80" cy="80" r="77" fill="var(--color-comic-yellow)" stroke="var(--color-ink)" strokeWidth="5" />
          <circle cx="80" cy="80" r="38" fill="var(--color-pulp)" stroke="var(--color-ink)" strokeWidth="3.5" strokeDasharray="5 4" />
        </svg>
        {/* Spinning ring text */}
        <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full animate-spin-slower">
          <defs>
            <path id={id} d="M80,80 m-57,0 a57,57 0 1,1 114,0 a57,57 0 1,1 -114,0" fill="none" />
          </defs>
          <text
            fontFamily="var(--font-bangers), var(--font-comic), sans-serif"
            fontSize="16"
            letterSpacing="2"
            fill="var(--color-ink)"
            textLength="352"
            lengthAdjust="spacing"
          >
            <textPath href={`#${id}`}>• PIZZA-MAN! • HOT &amp; FRESH • ISSUE N°1 </textPath>
          </text>
        </svg>
        {/* Static center — Bangers WITHOUT the ink stroke at small sizes:
            the 1.75px comic-title stroke turns "MIN. FLAT!" into a smudge. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="comic-title text-[2rem] leading-none text-comic-red sm:text-[2.3rem] lg:text-[2.6rem]">20</span>
          <span className="font-display text-[0.8rem] leading-tight tracking-wide text-ink sm:text-[0.9rem]">MIN. FLAT!</span>
        </div>
      </div>
    </div>
  )
}

/* ==================== HERO — THE COMIC BOOK COVER (pulp paper edition) ==================== */

export function CoverHero() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      /* ---------- Intro (cover) ---------- */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      /* Masthead row: side boxes pop, banner slams in, SplitText chars rain */
      tl.from(
        '.hero-mast-side',
        { scale: 0, autoAlpha: 0, rotation: 40, stagger: 0.09, duration: 0.4, ease: 'back.out(2.2)' }
      )

      const split = new SplitText('.hero-title', { type: 'chars,words' })
      tl.fromTo(
        '.hero-mast-banner',
        { y: -70, autoAlpha: 0, rotation: -4 },
        { y: 0, autoAlpha: 1, rotation: -1, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.2'
      )
        .from(
          split.chars,
          {
            yPercent: 130,
            autoAlpha: 0,
            rotation: () => gsap.utils.random(-28, 28),
            stagger: 0.025,
            duration: 0.45,
            ease: 'back.out(1.8)',
          },
          '-=0.25'
        )
        .from('.hero-strap', { scaleX: 0, autoAlpha: 0, duration: 0.35 }, '-=0.15')
        .from(
          '.hero-panel-wrap',
          { y: 46, autoAlpha: 0, scale: 0.94, duration: 0.5, ease: 'back.out(1.4)' },
          '-=0.2'
        )
        .from(
          '.hero-burst',
          { scale: 0, autoAlpha: 0, rotation: -120, duration: 0.55, ease: 'back.out(1.5)' },
          '-=0.25'
        )
        .fromTo(
          '.hero-char',
          { scale: 0, y: 80, rotation: -24, autoAlpha: 0 },
          { scale: 1, y: 0, rotation: -4, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.7)' },
          '-=0.2'
        )
        .from(
          '.hero-bubble',
          { scale: 0, autoAlpha: 0, rotation: -14, duration: 0.4, ease: 'back.out(2)' },
          '-=0.2'
        )
        .fromTo(
          '.hero-stamp',
          { scale: 0, rotation: 70, autoAlpha: 0 },
          { scale: 1, rotation: -12, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)' },
          '-=0.3'
        )
        .from(
          '.hero-info > *',
          { y: 26, autoAlpha: 0, stagger: 0.07, duration: 0.38 },
          '-=0.35'
        )
        .from('.hero-scroll', { y: 16, autoAlpha: 0, duration: 0.35 }, '-=0.15')

      /* ---------- Idle loops: char bob + burst spin (start after intro) ---------- */
      const idle = gsap.to('.hero-char', {
        y: 14,
        rotation: 0,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        paused: true,
      })
      const spin = gsap.to('.hero-burst', {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: 'none',
        paused: true,
      })

      let introDone = false
      tl.eventCallback('onComplete', () => {
        introDone = true
        idle.play()
        spin.play()
      })

      // Safety net: if the intro stalls (suspended tab, frozen rAF in headless
      // browsers, extensions…), JUMP to its final state instead of leaving the
      // CTAs/tagline invisible. Runs once; no-op when the intro finished clean.
      const safety = window.setTimeout(() => {
        if (introDone) return
        tl.progress(1)
        heroRef.current
          ?.querySelectorAll<HTMLElement>(
            '.hero-mast-side, .hero-mast-banner, .hero-title, .hero-strap, .hero-panel-wrap, .hero-burst, .hero-char, .hero-stamp, .hero-bubble, .hero-info > *, .hero-scroll'
          )
          .forEach((el) => {
            el.style.opacity = '1'
            el.style.visibility = 'visible'
            el.style.transform = 'none'
          })
      }, 2600)
      return () => window.clearTimeout(safety)
    },
    { scope: heroRef }
  )

  useGSAP(
    () => {
      /* ---------- Mouse parallax (desktop only) ---------- */
      const mq = gsap.matchMedia()
      mq.add('(pointer: fine)', () => {
        const hero = heroRef.current
        if (!hero) return

        const layers: { sel: string; f: number }[] = [
          { sel: '.hero-panel-wrap', f: -12 },
          { sel: '.hero-info', f: 8 },
          { sel: '.hero-mast-banner', f: 6 },
        ]
        const ing = gsap.utils.toArray<HTMLElement>('[data-depth]')

        const setters = layers.map((l) => ({
          f: l.f,
          x: gsap.quickTo(l.sel, 'x', { duration: 0.7, ease: 'power3' }),
          y: gsap.quickTo(l.sel, 'y', { duration: 0.7, ease: 'power3' }),
        }))
        const ingSetters = ing.map((el) => ({
          f: Number(el.dataset.depth ?? 0),
          x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
        }))

        const onMove = (e: MouseEvent) => {
          const cx = e.clientX / window.innerWidth - 0.5
          const cy = e.clientY / window.innerHeight - 0.5
          setters.forEach((s) => {
            s.x(cx * s.f)
            s.y(cy * s.f * 0.7)
          })
          ingSetters.forEach((s) => {
            s.x(cx * s.f)
            s.y(cy * s.f * 0.7)
          })
        }

        hero.addEventListener('mousemove', onMove)
        return () => hero.removeEventListener('mousemove', onMove)
      })
    },
    { scope: heroRef }
  )

  return (
    <section ref={heroRef} className="relative overflow-hidden border-b-[5px] border-ink bg-paper">
      {/* Print textures on the paper */}
      <HalftonePatch className="halftone-lg left-[2%] top-[3%] h-56 w-56 -rotate-6 rounded-full text-comic-red/15" />
      <HalftonePatch className="halftone-lg bottom-[4%] right-[2%] h-52 w-52 rotate-6 rounded-full text-comic-red/15" />
      <div aria-hidden className="speed-lines absolute inset-x-0 top-0 h-36 text-ink/[0.07]" />

      {/* Floating ingredients (parallax layers) */}
      {INGREDIENTS.map((ing) => (
        <div
          key={ing.name}
          aria-hidden
          data-depth={ing.depth}
          className={cn('absolute z-0', ing.className)}
        >
          <div className={cn('h-full w-full', ing.anim)}>{ing.svg}</div>
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 md:pt-32">
        {/* ---------- MASTHEAD (issue box — banner — price box) ---------- */}
        <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-3 sm:gap-4">
          <div className="hero-mast-side hidden -rotate-2 flex-col items-center justify-center border-[3px] border-ink bg-comic-yellow px-3 py-2 shadow-comic-sm sm:flex">
            <span className="font-display text-[10px] uppercase tracking-widest text-ink">Issue</span>
            <span className="comic-title text-3xl leading-none text-ink">N°1</span>
          </div>

          <div className="hero-mast-banner border-[4px] border-ink bg-comic-yellow px-3 py-2 text-center shadow-comic-lg sm:px-6 sm:py-3">
            <h1
              className="hero-title comic-title uppercase leading-[0.95] text-ink [-webkit-text-stroke:2.5px_var(--color-ink)] text-[clamp(2.6rem,7.2vw,6rem)]"
              style={{ textShadow: '0.05em 0.05em 0 var(--color-comic-red), 0.095em 0.095em 0 rgba(20,20,20,0.18)' }}
            >
              Pizza-Man!
            </h1>
          </div>

          <div className="hero-mast-side hidden rotate-2 flex-col items-center justify-center border-[3px] border-ink bg-ink px-3 py-2 shadow-comic-sm sm:flex">
            <span className="font-display text-[10px] uppercase tracking-widest text-pulp">From</span>
            <span className="comic-title text-3xl leading-none text-comic-yellow">€8.90</span>
          </div>
        </div>

        {/* ---------- STRAPLINE ---------- */}
        <div className="hero-strap mx-auto mt-3 w-fit max-w-full border-[3px] border-ink bg-ink px-4 py-2 text-center shadow-comic-sm sm:px-6">
          <p className="font-display text-[11px] uppercase tracking-[0.2em] text-pulp sm:text-sm sm:tracking-[0.28em]">
            The super hero of pizza — hot &amp; fresh in 20 minutes
          </p>
        </div>

        {/* ---------- COVER GRID: art panel + info column ---------- */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          {/* Cover art — framed splash panel, like a real cover */}
          <div className="hero-panel-wrap relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <RotatingStamp className="-right-5 -top-8 w-28 sm:w-32 lg:-right-8 lg:-top-10 lg:w-40" />
            <div className="hero-panel relative aspect-square -rotate-1 overflow-hidden border-[5px] border-ink bg-[#d13026] shadow-comic-xl sm:aspect-[4/3.1]">
              {/* Sunburst rays inside the panel */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    'repeating-conic-gradient(from 0deg at 50% 50%, var(--color-comic-red) 0deg 9deg, #d13026 9deg 18deg)',
                }}
              />
              <div aria-hidden className="speed-lines absolute inset-x-0 top-0 h-24 text-ink/10" />
              <HalftonePatch className="halftone-lg bottom-[4%] left-[3%] h-32 w-32 rounded-full text-pulp/20" />

              <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                <Starburst
                  points={14}
                  className="hero-burst aspect-square w-[88%] text-comic-yellow drop-shadow-[8px_8px_0_var(--color-ink)]"
                />
              </div>
              <div aria-hidden className="halftone absolute inset-[16%] text-ink/15" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/comic/logo-mark.png"
                  alt="Pizza-Man! — flying superhero pizza slice, fist raised"
                  width={480}
                  height={386}
                  priority
                  className="hero-char relative z-10 w-[70%] drop-shadow-[9px_9px_0_rgba(20,20,20,0.85)]"
                />
              </div>

              <SpeechBubble className="hero-bubble left-3 top-4 max-w-[210px] sm:left-5 sm:top-6">
                <p className="comic-title-sm text-lg uppercase leading-tight text-ink sm:text-xl">
                  Hungry, citizen?
                </p>
              </SpeechBubble>

              <Ono
                word="FRESH!"
                size="text-3xl"
                burstColor="text-comic-yellow"
                textClass="text-comic-red"
                className="bottom-3 left-3 sm:bottom-4 sm:left-4"
              />
            </div>
          </div>

          {/* Info column */}
          <div className="hero-info text-center lg:text-left">
            <span className="inline-flex rotate-1 items-center gap-2 border-[3px] border-ink bg-comic-yellow px-3.5 py-1.5 font-display text-sm uppercase tracking-widest text-ink shadow-comic-sm">
              <Star className="h-4 w-4 fill-ink" /> 100% hero-grade pizza
            </span>

            <h2 className="comic-title mt-5 text-4xl uppercase leading-[1.04] text-ink sm:text-5xl">
              One bite.
              <br />
              Instant{' '}
              <span className="relative inline-block -rotate-1 border-[3px] border-ink bg-comic-yellow px-2 text-ink shadow-comic-sm">
                superpowers!
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-base font-bold leading-relaxed text-ink/75 lg:mx-0 sm:text-lg">
              Hand-stretched dough. Thunderstruck toppings. One legendary box
              hides further down this page —{' '}
              <span className="font-display uppercase tracking-wide text-comic-red">
                dare to unbox it.
              </span>
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
              <Magnetic>
                <ComicLink href="/menu" color="yellow" className="w-full sm:w-auto">
                  Order now! <ArrowRight className="h-5 w-5" />
                </ComicLink>
              </Magnetic>
              <Magnetic>
                <ComicLink href="#find-us" color="ink" className="w-full sm:w-auto">
                  <Bike className="h-5 w-5" /> Find the pizzeria
                </ComicLink>
              </Magnetic>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <div className="flex -space-x-3">
                {['/comic/avatar-1.png', '/comic/avatar-2.png', '/comic/avatar-3.png'].map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border-[3px] border-ink object-cover"
                  />
                ))}
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-ink font-display text-xs text-comic-yellow">
                  +12K
                </span>
              </div>
              <div>
                <div className="flex justify-center gap-0.5 lg:justify-start" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-comic-yellow text-ink" />
                  ))}
                </div>
                <p className="mt-1 text-sm font-bold text-ink/80">
                  12,000+ hungry citizens saved every single month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- SCROLL ON ---------- */}
        <div className="mt-10 flex justify-center">
          <a
            href="#how"
            aria-label="Scroll to how it works"
            className="hero-scroll animate-bob flex h-14 w-14 items-center justify-center border-[4px] border-ink bg-comic-yellow shadow-comic transition-transform hover:-translate-y-1"
          >
            <ArrowDown className="h-6 w-6 text-ink" />
          </a>
        </div>
      </div>

      {/* Side onomatopoeia */}
      <Ono
        word="HOT!"
        size="text-3xl sm:text-4xl"
        burstColor="text-comic-pink"
        textClass="text-ink"
        className="bottom-[13%] right-[1%] hidden lg:block"
      />
    </section>
  )
}
