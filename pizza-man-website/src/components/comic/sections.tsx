'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Clock,
  Flame,
  Heart,
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Pizza,
  Rocket,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import {
  Caption,
  ComicHeading,
  ComicLink,
  DishImage,
  comicChipBg,
  HalftonePatch,
  Ono,
  PanelTag,
  Squiggle,
  Stamp,
  Starburst,
  type ComicColor,
} from '@/components/comic/primitives'
import {
  MENU_ITEMS,
  PIZZERIA_HOURS,
  formatPrice,
} from '@/lib/menu-data'
import { GOOGLE_MAPS_EMBED_URL, PIZZERIA_ADDRESS, PIZZERIA_PHONE_DISPLAY } from '@/lib/cart-store'

/* ==================== MARQUEE BANDS (GSAP + velocity skew) ==================== */

const BAND_ONE = ['BOOM!', 'CRUNCH!', 'YUM!', 'ZAP!', 'SMASH!', 'SLICE!', 'BOING!', 'WOW!']
const BAND_TWO = [
  'MOZZARELLA',
  'PEPPERONI',
  'EXTRA CHEESE',
  'FRESH DOUGH',
  'HOT & FRESH',
  'SUPER SPEED',
  'FAMILY RECIPES',
  'PIZZA-MAN!',
]

function Band({
  items,
  reverse = false,
  bandClassName,
  sepClassName,
  duration = 22,
}: {
  items: string[]
  reverse?: boolean
  bandClassName?: string
  sepClassName?: string
  duration?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reverse) {
      gsap.fromTo(
        trackRef.current,
        { xPercent: -50 },
        { xPercent: 0, ease: 'none', duration, repeat: -1 }
      )
    } else {
      gsap.to(trackRef.current, { xPercent: -50, ease: 'none', duration, repeat: -1 })
    }
  })

  return (
    <div className={`overflow-hidden border-y-[4px] border-ink py-3 ${bandClassName ?? ''}`}>
      <div ref={trackRef} className="band-track flex w-max will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} aria-hidden={dup === 1} className="flex items-center gap-10 pr-10">
            {items.map((w) => (
              <span
                key={w}
                className="flex items-center gap-10 whitespace-nowrap font-display text-2xl uppercase tracking-widest"
              >
                {w}
                <Star className={`h-6 w-6 shrink-0 ${sepClassName ?? ''}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MarqueeBands() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Skew the bands with scroll velocity — comic speed effect
      const proxy = { skew: 0 }
      const skewSetter = gsap.quickSetter('.band-track', 'skewX', 'deg')
      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-10, 10, self.getVelocity() / -280)
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew
            gsap.to(proxy, {
              skew: 0,
              duration: 0.7,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            })
          }
        },
      })
    },
    { scope: ref }
  )

  return (
    <section ref={ref} aria-hidden className="relative py-10">
      <Band
        items={BAND_ONE}
        bandClassName="w-[110%] -ml-[5%] -rotate-1 bg-comic-red text-pulp"
        sepClassName="fill-comic-yellow text-ink"
        duration={20}
      />
      <Band
        items={BAND_TWO}
        reverse
        bandClassName="w-[110%] -ml-[5%] -mt-4 rotate-[1.5deg] bg-ink text-comic-yellow"
        sepClassName="fill-comic-red text-comic-red"
        duration={26}
      />
    </section>
  )
}

/* ==================== HOW IT WORKS (3 comic steps) ==================== */

const STRIP_STEPS = [
  {
    n: '1',
    icon: Pizza,
    color: 'yellow' as ComicColor,
    title: 'Pick',
    desc: 'Browse the menu and choose your hero pizza. Spicy, cheesy, veggie — every craving gets its champion.',
  },
  {
    n: '2',
    icon: Flame,
    color: 'purple' as ComicColor,
    title: 'We blast it',
    desc: 'Your pizza is hand-stretched and fired at 450°C. Watch out: spectacular bubbling cheese ahead!',
  },
  {
    n: '3',
    icon: Rocket,
    color: 'red' as ComicColor,
    title: 'Hero delivery',
    desc: '20 minutes later, BOOM — a steaming box lands at your door. Effects guaranteed on first bite.',
  },
]

export function ComicStrip() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.strip-head > *', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      gsap.from('.strip-panel', {
        x: (i) => (i % 2 === 0 ? -140 : 140),
        autoAlpha: 0,
        rotation: (i) => (i % 2 === 0 ? -6 : 6),
        stagger: 0.16,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.strip-grid', start: 'top 80%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="how" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden border-y-[4px] border-ink bg-comic-yellow/30 py-20 md:py-28">
      <div aria-hidden className="speed-lines absolute inset-0 text-ink/[0.05]" />
      <Caption className="left-4 top-5 hidden sm:left-8 sm:block">Chapter one — the plot</Caption>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="strip-head text-center">
          <PanelTag className="bg-comic-red text-pulp">
            <Flame className="h-4 w-4" /> The story in 3 panels
          </PanelTag>
          <ComicHeading className="mt-6 text-ink">
            Three panels and <span className="text-comic-red">BOOM!</span>
          </ComicHeading>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-ink/70">
            No 300-page photo novel here: your flavor adventure fits in three panels.
          </p>
        </div>

        <div className="strip-grid relative mt-16">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-10 hidden border-t-4 border-dashed border-ink/40 lg:block"
          />
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STRIP_STEPS.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.n} className="strip-panel relative text-center">
                  <div
                    className={`relative mx-auto flex h-20 w-20 -rotate-3 items-center justify-center border-[4px] border-ink shadow-comic ${comicChipBg[s.color]}`}
                  >
                    <Icon className="h-9 w-9" />
                    <span className="absolute -right-3 -top-3 flex h-8 w-8 rotate-12 items-center justify-center border-[3px] border-ink bg-ink font-display text-sm text-comic-yellow">
                      {s.n}
                    </span>
                  </div>
                  <div className="relative mt-6 inline-block border-[4px] border-ink bg-pulp px-6 py-5 shadow-comic">
                    <span
                      aria-hidden
                      className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 border-2 border-ink/40 bg-comic-yellow/85"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(-45deg, rgba(20,20,20,0.12) 0 4px, transparent 4px 9px)',
                      }}
                    />
                    <h3 className="comic-title text-2xl uppercase text-ink">{s.title}</h3>
                    <p className="mt-2 max-w-xs font-bold leading-relaxed text-ink/70">{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== MENU PREVIEW (featured heroes) ==================== */

const FEATURED_IDS = ['pepperoni', 'pizza-man-special', 'margherita', 'inferno']

export function MenuPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const featured = FEATURED_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
  )

  useGSAP(
    () => {
      gsap.from('.preview-head > *', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      gsap.from('.preview-card', {
        y: 90,
        autoAlpha: 0,
        rotation: (i) => (i % 2 === 0 ? -4 : 4),
        scale: 0.94,
        stagger: 0.1,
        duration: 0.65,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28">
      <HalftonePatch className="halftone-lg left-[6%] top-24 h-48 w-48 rounded-full text-comic-purple/15" />
      <Caption className="left-4 top-5 hidden sm:left-8 sm:block">Meanwhile, in Kitchen City&hellip;</Caption>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="preview-head text-center">
          <PanelTag className="bg-comic-teal text-ink">
            <Pizza className="h-4 w-4" /> Featured heroes
          </PanelTag>
          <ComicHeading className="mt-6 text-ink">
            Tonight&rsquo;s <span className="text-comic-red">crime-fighting</span> pizzas
          </ComicHeading>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-ink/70">
            Four legends pulled straight from the menu. The full league is waiting on the menu page.
          </p>
          <Squiggle className="mx-auto mt-4 h-6 w-40 text-comic-red" />
        </div>

        <div ref={gridRef} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <article
              key={m.id}
              className="preview-card group relative flex flex-col border-[4px] border-ink bg-pulp shadow-comic transition-transform hover:-translate-y-1.5"
            >
              {m.badge && (
                <span
                  className={cn(
                    'absolute -right-2 -top-3 z-10 rotate-3 border-[3px] border-ink px-2 py-0.5 font-display text-xs uppercase tracking-widest shadow-comic-sm',
                    m.badge === 'Bestseller' && 'bg-comic-yellow text-ink',
                    m.badge === 'Spicy' && 'bg-comic-red text-pulp',
                    m.badge === 'Veggie' && 'bg-comic-teal text-ink',
                    m.badge === 'New' && 'bg-comic-pink text-ink'
                  )}
                >
                  {m.badge}
                </span>
              )}
              <DishImage
                image={m.image}
                icon={m.icon}
                name={m.name}
                className="aspect-square w-full border-b-[4px] border-ink"
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="comic-title text-xl uppercase text-ink">{m.name}</h3>
                <p className="mt-1.5 flex-1 text-sm font-bold leading-relaxed text-ink/65">
                  {m.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="comic-title text-2xl text-comic-red">{formatPrice(m.price)}</span>
                  <ComicLink href="/menu" color="yellow" className="px-3 py-1.5 text-sm" aria-label={`Order ${m.name}`}>
                    Order
                  </ComicLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative z-10 mt-12 text-center">
          <ComicLink href="/menu" color="red" className="px-8 py-4 text-xl">
            See the full menu <ArrowRight className="h-5 w-5" />
          </ComicLink>
          <p className="mt-3 text-sm font-bold text-ink/50">
            14 heroes, 2 duo deals, 0 boring bites.
          </p>
        </div>
      </div>

      <Stamp className="bottom-24 right-6 hidden lg:block" />
      <Ono
        word="SLURP!"
        size="text-4xl"
        burstColor="text-comic-teal"
        textClass="text-ink"
        className="bottom-24 -left-2 hidden lg:block"
      />
    </section>
  )
}

/* ==================== IMPACT NUMBERS (stats) ==================== */

const STATS = [
  { to: 12, suffix: 'K+', decimals: 0, label: 'slices delivered monthly', shadow: 'shadow-[8px_8px_0_0_var(--color-comic-yellow)]' },
  { to: 98, suffix: '%', decimals: 0, label: 'happy citizens', shadow: 'shadow-[8px_8px_0_0_var(--color-comic-red)]' },
  { to: 4.9, suffix: '/5', decimals: 1, label: 'hero rating', shadow: 'shadow-[8px_8px_0_0_var(--color-comic-teal)]' },
  { to: 20, suffix: 'min', decimals: 0, label: 'average delivery time', shadow: 'shadow-[8px_8px_0_0_var(--color-comic-purple)]' },
]

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Panel slam + screen shake
      const tl = gsap.timeline({
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
      })
      tl.from('.stat-panel', {
        scale: 1.7,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.4,
        ease: 'power4.out',
      }).to(sectionRef.current, {
        keyframes: { x: [0, -8, 7, -5, 3, 0] },
        duration: 0.4,
        ease: 'power1.inOut',
      })

      // Animated counters
      STATS.forEach((s, i) => {
        const el = gridRef.current?.querySelectorAll<HTMLElement>('.stat-value')[i]
        if (!el) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: s.to,
          duration: 1.6,
          delay: 0.3 + i * 0.09,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(s.decimals)
          },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-20 text-pulp md:py-28">
      <HalftonePatch className="halftone-lg -left-10 top-10 h-48 w-48 text-comic-red/30" />
      <HalftonePatch className="halftone-lg -right-10 bottom-10 h-48 w-48 text-comic-yellow/25" />
      <div aria-hidden className="speed-lines absolute inset-0 text-pulp/[0.04]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span
          className="font-display text-[28vw] uppercase leading-none md:text-[16rem]"
          style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255, 253, 242, 0.14)' }}
        >
          YUM!
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <PanelTag>
            <Star className="h-4 w-4" /> Impact numbers
          </PanelTag>
          <ComicHeading className="mt-6 text-pulp">
            Numbers that go <span className="text-comic-yellow">BOOM!</span>
          </ComicHeading>
        </div>

        <div ref={gridRef} className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`stat-panel border-[4px] border-ink bg-pulp p-6 text-ink ${s.shadow}`}
            >
              <p className="comic-title text-4xl text-comic-red md:text-5xl">
                <span className="stat-value">0</span>
                {s.suffix}
              </p>
              <p className="mt-1 text-sm font-bold text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <Ono
        word="WHAM!"
        size="text-4xl"
        burstColor="text-comic-red"
        textClass="text-pulp"
        className="left-1 top-[24%] hidden lg:block"
      />
    </section>
  )
}

/* ==================== FAN MAIL (reviews) ==================== */

const FAN_MAIL = [
  {
    quote:
      'My pizza arrived before my movie even started. The crust is crispier than a fresh comic page — I am speechless!',
    name: 'Lina M.',
    role: 'Margherita loyalist',
    avatar: '/comic/avatar-1.png',
    rotate: -2,
  },
  {
    quote:
      'Ordered the Inferno Chili Blast on a dare. Survived. Ordered it again the next day. This place has superpowers.',
    name: 'Karim D.',
    role: 'Spicy-food daredevil',
    avatar: '/comic/avatar-2.png',
    rotate: 1.5,
  },
  {
    quote:
      'The mini-comic in the box made my kid eat all his veggies. Pizza-Man is basically a parenting cheat code!',
    name: 'Sofia R.',
    role: 'Mom of two tiny heroes',
    avatar: '/comic/avatar-3.png',
    rotate: 3,
  },
]

export function FanMail() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.fan-head > *', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      gsap.from('.fan-letter', {
        x: (i) => (i % 2 === 0 ? -120 : 120),
        y: 60,
        autoAlpha: 0,
        stagger: 0.14,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fan-grid', start: 'top 82%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="reviews" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden py-20 md:py-28">
      <HalftonePatch className="halftone bottom-16 left-8 h-36 w-36 rounded-full text-comic-purple/20" />
      <Stamp className="right-2 top-8 hidden sm:block sm:right-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="fan-head text-center">
          <PanelTag className="bg-comic-pink text-ink">
            <Heart className="h-4 w-4" /> Fan mail
          </PanelTag>
          <ComicHeading className="mt-6 text-ink">
            Letters from the <span className="text-comic-red">hungry league</span>
          </ComicHeading>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-ink/70">
            Citizens from every district devour our slices. Here is what they write back.
          </p>
          <Squiggle className="mx-auto mt-4 h-6 w-40 text-comic-red" />
        </div>

        <div className="fan-grid mt-14 grid gap-8 md:grid-cols-3">
          {FAN_MAIL.map((f) => (
            <figure
              key={f.name}
              className="fan-letter relative flex h-full flex-col border-[4px] border-ink bg-pulp p-6 shadow-comic transition-transform hover:-translate-y-1"
              style={{ transform: `rotate(${f.rotate}deg)` }}
            >
              {/* pasted-photo tape, comic scrapbook style */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-2 border-2 border-ink/40 bg-comic-pink/80"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, rgba(20,20,20,0.12) 0 4px, transparent 4px 9px)',
                }}
              />
              <div className="flex gap-1" aria-label="Rated 5 stars out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-comic-yellow text-ink" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg font-bold italic leading-relaxed text-ink/80">
                “{f.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Image
                  src={f.avatar}
                  alt={`Comic portrait of ${f.name}`}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-[3px] border-ink object-cover"
                />
                <div>
                  <p className="comic-title-sm text-lg text-ink">{f.name}</p>
                  <p className="text-sm font-bold text-ink/60">{f.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Ono
        word="CRUNCH!"
        size="text-3xl"
        burstColor="text-comic-yellow"
        textClass="text-comic-red"
        className="bottom-24 -left-2 hidden lg:block"
      />
    </section>
  )
}

/* ==================== FIND US (map + hours) ==================== */

export function FindUs() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.find-head > *', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      gsap.from('.find-map', {
        x: 140,
        rotation: 8,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.find-grid', start: 'top 80%', once: true },
      })
      gsap.from('.find-info > *', {
        x: -80,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.find-grid', start: 'top 80%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="find-us" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden border-y-[4px] border-ink bg-comic-teal/20 py-20 md:py-28">
      <HalftonePatch className="halftone-lg right-[10%] top-16 h-44 w-44 rounded-full text-comic-red/15" />
      <div aria-hidden className="speed-lines absolute inset-0 text-ink/[0.04]" />
      <Caption className="left-4 top-5 hidden sm:left-8 sm:block">The hideout — tell no one</Caption>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="find-head text-center">
          <PanelTag className="bg-comic-yellow text-ink">
            <MapPin className="h-4 w-4" /> Secret headquarters
          </PanelTag>
          <ComicHeading className="mt-6 text-ink">
            Find the <span className="text-comic-red">pizzeria</span>
          </ComicHeading>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-ink/70">
            Come grab your pizza straight from the oven, or call the hero hotline for takeaway.
          </p>
        </div>

        <div className="find-grid mt-14 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="find-info space-y-5">
            <div className="border-[4px] border-ink bg-pulp p-5 shadow-comic">
              <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-widest text-ink">
                <MapPin className="h-5 w-5 text-comic-red" /> Address
              </h3>
              <p className="mt-2 font-bold text-ink/75">{PIZZERIA_ADDRESS}</p>
              <p className="mt-1 text-sm font-bold text-ink/50">
                Delivery all around the 11th arrondissement — 20 min average, FREE over €25.
              </p>
            </div>

            <div className="border-[4px] border-ink bg-pulp p-5 shadow-comic">
              <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-widest text-ink">
                <Clock className="h-5 w-5 text-comic-red" /> Opening hours
              </h3>
              <table className="mt-2 w-full text-left">
                <tbody>
                  {PIZZERIA_HOURS.map((h) => (
                    <tr key={h.days} className="border-b-[3px] border-dashed border-ink/25 last:border-0">
                      <th scope="row" className="py-1.5 pr-3 font-bold text-ink/75">{h.days}</th>
                      <td className="py-1.5 text-right font-display text-base tracking-wide text-ink">{h.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-[4px] border-ink bg-ink p-5 text-pulp shadow-comic">
              <h3 className="flex items-center gap-2 font-display text-lg uppercase tracking-widest text-comic-yellow">
                <Phone className="h-5 w-5" /> Hero hotline
              </h3>
              <p className="mt-2 font-bold text-pulp/80">
                Call <span className="font-display text-lg tracking-wide text-comic-yellow">{PIZZERIA_PHONE_DISPLAY}</span> — a real human answers (a very hungry one).
              </p>
            </div>
          </div>

          <div className="find-map relative rotate-1 border-[5px] border-ink bg-pulp p-3 shadow-comic-xl">
            <div className="relative overflow-hidden border-[3px] border-ink">
              <iframe
                title="Map — Pizza-Man! pizzeria in Paris"
                src={GOOGLE_MAPS_EMBED_URL}
                className="h-[320px] w-full md:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-center font-display text-sm uppercase tracking-widest text-ink/70">
              Warning: the smell of fresh dough may guide you the whole way.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== FINAL CTA — EXPLOSION ==================== */

const CTA_CHIPS = [
  { label: '20 min delivery', rotate: '-rotate-2' },
  { label: 'FREE over €25', rotate: 'rotate-1' },
  { label: 'Fresh daily', rotate: '-rotate-1' },
]

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cta-panel', {
        scale: 0.55,
        autoAlpha: 0,
        rotation: 8,
        ease: 'elastic.out(1, 0.6)',
        duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="cta" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden py-20 md:py-28">
      <div aria-hidden className="speed-lines absolute inset-0 text-ink/[0.05]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="cta-panel relative overflow-hidden border-[5px] border-ink bg-comic-red px-6 py-14 text-center shadow-comic-xl md:px-16">
          <Starburst
            points={14}
            className="absolute -left-16 -top-16 h-56 w-56 animate-spin-slower text-comic-yellow"
          />
          <Starburst
            points={10}
            className="absolute -bottom-20 -right-16 h-64 w-64 animate-spin-slower text-comic-yellow/80"
          />

          <ComicHeading className="relative text-4xl text-pulp md:text-6xl">
            Hungry, <span className="text-comic-yellow">hero</span>?
          </ComicHeading>
          <p className="relative mx-auto mt-4 max-w-xl text-lg font-bold text-pulp/90">
            Order in two clicks, devour in twenty minutes. Your taste buds are about to join the
            adventure of a lifetime!
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ComicLink href="/menu" color="yellow" className="h-14 px-8 text-xl">
              Order now <ArrowRight className="h-5 w-5" />
            </ComicLink>
            <ComicLink href="#find-us" color="pulp" className="h-14 px-8 text-xl">
              <MapPin className="h-5 w-5" /> Eat at the HQ
            </ComicLink>
          </div>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {CTA_CHIPS.map((c) => (
              <span
                key={c.label}
                className={`border-[3px] border-ink bg-pulp px-4 py-1.5 font-display text-sm uppercase tracking-widest text-ink shadow-comic-sm ${c.rotate}`}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <Ono
          word="BOOM!"
          size="text-5xl sm:text-6xl"
          burstColor="text-comic-yellow"
          textClass="text-comic-red"
          className="-top-8 right-2 sm:right-10"
        />
        <Ono
          word="YUM!"
          size="text-4xl"
          burstColor="text-comic-yellow"
          textClass="text-comic-red"
          className="-bottom-4 left-1 sm:-left-4"
        />
      </div>
    </section>
  )
}

/* ==================== FOOTER ==================== */

const FOOTER_EXPLORE = [
  { href: '/menu', label: 'The menu' },
  { href: '/#how', label: 'How it works' },
  { href: '/#find-us', label: 'Find us' },
]

const FOOTER_INFO = [
  { href: '/#find-us', label: 'Opening hours' },
  { href: '/#find-us', label: 'Delivery zone' },
  { href: '/#reviews', label: 'Fan mail' },
  { href: '/#cta', label: 'Order now' },
]

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', chip: 'bg-comic-yellow text-ink' },
  { icon: Facebook, label: 'Facebook', chip: 'bg-comic-teal text-ink' },
  { icon: TwitterIcon, label: 'Twitter', chip: 'bg-comic-red text-pulp' },
]

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.35l7.24-8.28L2.4 2h6.4l4.42 5.85L18.9 2Zm-1.1 18.13h1.73L7.86 3.77H6.01L17.8 20.13Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t-[4px] border-ink bg-ink text-pulp">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <a href="/" className="flex w-fit items-center gap-2.5" aria-label="Pizza-Man! — back to top">
            <Image
              src="/comic/logo-mark.png"
              alt=""
              width={677}
              height={544}
              className="h-12 w-auto -rotate-3 drop-shadow-[3px_3px_0_var(--color-comic-yellow)] transition-transform hover:rotate-6"
            />
            <span className="comic-title text-2xl text-pulp">
              Pizza-Man<span className="text-comic-yellow">!</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs font-bold text-pulp/70">
            The comic-book pizzeria. Hot slices, heroic flavors, one issue at a time.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href="#"
                  aria-label={`Pizza-Man! on ${s.label}`}
                  className={`flex h-11 w-11 items-center justify-center border-[3px] border-ink transition-transform hover:-translate-y-1 hover:rotate-6 ${s.chip}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>

        <nav aria-label="Explore">
          <p className="font-display text-lg uppercase tracking-widest text-comic-yellow">Explore</p>
          <ul className="mt-4 space-y-2.5 font-bold text-pulp/75">
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-all hover:pl-1 hover:text-comic-yellow">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Practical info">
          <p className="font-display text-lg uppercase tracking-widest text-comic-yellow">Good to know</p>
          <ul className="mt-4 space-y-2.5 font-bold text-pulp/75">
            {FOOTER_INFO.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-all hover:pl-1 hover:text-comic-yellow">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-display text-lg uppercase tracking-widest text-comic-yellow">Stay hungry!</p>
          <p className="mt-3 text-sm font-bold text-pulp/70">
            New hero specials and secret deals land in the shop every month. First slice, first served.
          </p>
          <ComicLink href="/menu" color="yellow" className="mt-5 px-5 py-2.5 text-base">
            See today&rsquo;s menu
          </ComicLink>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t-[3px] border-pulp/15 px-4 py-6 text-center text-sm font-bold text-pulp/60 sm:flex-row sm:px-8 sm:text-left">
        <p>
          © 2026 Pizza-Man! — Made with{' '}
          <Heart className="inline h-4 w-4 fill-comic-red text-comic-red" aria-hidden /> and a whole lot of ink.
        </p>
        <p className="font-display text-xs uppercase tracking-[0.25em] text-pulp/50">
          Issue N°1 — the end… for now!
        </p>
      </div>
    </footer>
  )
}
