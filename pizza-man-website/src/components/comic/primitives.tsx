'use client'

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'
import { DishIcon } from '@/components/comic/dish-icons'
import type { DishIconName } from '@/lib/menu-data'

/* ============ Couleurs comic ============ */

export type ComicColor = 'red' | 'yellow' | 'pink' | 'teal' | 'purple' | 'orange' | 'pulp' | 'ink'

export const comicChipBg: Record<ComicColor, string> = {
  red: 'bg-comic-red text-pulp',
  yellow: 'bg-comic-yellow text-ink',
  pink: 'bg-comic-pink text-ink',
  teal: 'bg-comic-teal text-ink',
  purple: 'bg-comic-purple text-pulp',
  orange: 'bg-comic-orange text-ink',
  pulp: 'bg-pulp text-ink',
  ink: 'bg-ink text-comic-yellow',
}

/* ============ Boutons comic ============ */

const comicActionBase =
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 border-[4px] border-ink font-display text-lg uppercase tracking-wider shadow-comic transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-comic-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-comic-yellow/80'

type ComicActionProps = { color?: ComicColor }

export function ComicButton({
  color = 'red',
  className,
  type = 'button',
  ...props
}: ComicActionProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(comicActionBase, comicChipBg[color], 'rounded-lg px-7 py-3', className)}
      {...props}
    />
  )
}

export function ComicLink({
  color = 'red',
  className,
  ...props
}: ComicActionProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(comicActionBase, comicChipBg[color], 'rounded-lg px-7 py-3', className)} {...props} />
  )
}

/* ============ Panel tag ============ */

export function PanelTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex -rotate-2 items-center gap-2 border-[3px] border-ink bg-comic-yellow px-4 py-1.5 font-display text-sm uppercase tracking-widest shadow-comic-sm',
        className
      )}
    >
      {children}
    </span>
  )
}

/* ============ Comic title with outline ============ */

export function ComicHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('comic-title text-4xl uppercase leading-[1.05] md:text-5xl', className)}>{children}</h2>
  )
}

/* ============ Starburst (explosion) ============ */

export function Starburst({
  className,
  points = 12,
  stretch = false,
}: {
  className?: string
  points?: number
  /**
   * stretch: sets preserveAspectRatio="none" so the burst fills its whole
   * container (elongated shapes) while keeping the text perfectly centered.
   * Default remains "meet" (keeps the original square usage intact).
   */
  stretch?: boolean
}) {
  // 2-decimal rounding guarantees identical server/client rendering (hydration-safe)
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 35
    const a = (Math.PI * i) / points
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio={stretch ? 'none' : undefined}
      className={className}
      aria-hidden="true"
    >
      <polygon points={pts} fill="currentColor" stroke="var(--color-ink)" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  )
}

/* ============ Animated onomatopoeia (POW! ZAP!...) ============ */

export function Ono({
  word,
  burstColor = 'text-comic-yellow',
  textClass = 'text-comic-red',
  className,
  size = 'text-4xl',
}: {
  word: string
  burstColor?: string
  textClass?: string
  className?: string
  size?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.ono-inner', {
        scale: 0,
        autoAlpha: 0,
        rotation: -20,
        ease: 'elastic.out(1, 0.5)',
        duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
      gsap.to('.ono-inner', {
        y: -10,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn('pointer-events-none absolute z-20', className)} aria-hidden="true">
      <div className="ono-inner relative">
        {/* Extensor wrapper: the burst stretches with the word so it always
            stays centered behind the text (Round 9 fix). */}
        <div className={cn('absolute -inset-5 -z-10 sm:-inset-7', burstColor)}>
          <Starburst stretch className="h-full w-full" />
        </div>
        <span
          className={cn('comic-title block -rotate-6 whitespace-nowrap', size, textClass)}
          style={{ textShadow: '4px 4px 0 var(--color-ink)' }}
        >
          {word}
        </span>
      </div>
    </div>
  )
}

/* ============ Speech bubble ============ */

export function SpeechBubble({
  children,
  className,
  tailRight = false,
}: {
  children: ReactNode
  className?: string
  tailRight?: boolean
}) {
  return (
    <div
      className={cn(
        'relative rounded-[1.6rem] border-[4px] border-ink bg-pulp px-5 py-3 text-ink shadow-comic',
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'absolute -bottom-3 h-5 w-5 rotate-45 border-b-[4px] border-r-[4px] border-ink bg-pulp',
          tailRight ? 'right-10' : 'left-10'
        )}
      />
    </div>
  )
}

/* ============ Squiggle drawn on scroll ============ */

export function Squiggle({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const path = ref.current?.querySelector('path')
      if (!path) return
      const len = path.getTotalLength()
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
        }
      )
    },
    { scope: ref }
  )

  return (
    <svg ref={ref} viewBox="0 0 160 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 14 Q 15 4, 27 14 T 51 14 T 75 14 T 99 14 T 123 14 T 147 14"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ============ Round stamp ============ */

export function Stamp({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(ref.current, {
        scale: 0,
        rotation: -160,
        ease: 'back.out(2.2)',
        duration: 0.8,
        scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true },
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn('pointer-events-none absolute z-20', className)} aria-hidden="true">
      <div className="flex h-28 w-28 -rotate-12 items-center justify-center rounded-full border-[4px] border-ink bg-comic-teal p-1.5 shadow-comic sm:h-32 sm:w-32">
        <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-ink bg-pulp px-2 text-center">
          <p className="font-display text-xs uppercase leading-tight tracking-wide text-ink sm:text-sm">
            100% fun
            <br />
            approved by
            <br />
            the pizza league
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============ Decorative halftone patch ============ */

export function HalftonePatch({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('pointer-events-none absolute', className)} />
}

/* ============ Comic narration caption box ("MEANWHILE…") ============ */

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-20 inline-block -rotate-1 border-[3px] border-ink bg-comic-yellow px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-ink shadow-comic-sm sm:text-sm',
        className
      )}
    >
      {children}
    </span>
  )
}

/* ============ Magnetic hover wrapper (desktop pointers only) ============ */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mq = gsap.matchMedia()
      mq.add('(pointer: fine)', () => {
        const el = ref.current
        if (!el) return

        let rect: DOMRect | null = null
        const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })

        const onEnter = () => {
          rect = el.getBoundingClientRect()
        }
        const onMove = (e: MouseEvent) => {
          if (!rect) rect = el.getBoundingClientRect()
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
        }
        const onLeave = () => {
          rect = null
          xTo(0)
          yTo(0)
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return () => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mousemove', onMove)
          el.removeEventListener('mouseleave', onLeave)
        }
      })
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      <span className="inline-block">{children}</span>
    </span>
  )
}

/* ============ Torn comic-page zigzag edge between sections ============ */

const ZIGZAG_PATH =
  'M0 28 L30 6 L60 28 L90 6 L120 28 L150 6 L180 28 L210 6 L240 28 L270 6 L300 28 L330 6 ' +
  'L360 28 L390 6 L420 28 L450 6 L480 28 L510 6 L540 28 L570 6 L600 28 L630 6 L660 28 L690 6 ' +
  'L720 28 L750 6 L780 28 L810 6 L840 28 L870 6 L900 28 L930 6 L960 28 L990 6 L1020 28 L1050 6 ' +
  'L1080 28 L1110 6 L1140 28 L1170 6 L1200 28 Z'

export function ZigzagEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 28"
      preserveAspectRatio="none"
      className={cn('block h-5 w-full', className)}
      aria-hidden="true"
    >
      <path d={ZIGZAG_PATH} fill="currentColor" />
    </svg>
  )
}

/* ============ Dish image with comic icon fallback (no emojis) ============ */

export function DishImage({
  image,
  icon,
  name,
  className,
  sizes,
  eager = false,
}: {
  image: string | null
  icon: DishIconName
  name: string
  className?: string
  sizes?: string
  /** Above-the-fold images should load eagerly (kills the LCP pop-in). */
  eager?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'halftone relative flex items-center justify-center overflow-hidden bg-comic-yellow/40',
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes ?? '320px'}
          loading={eager ? 'eager' : undefined}
          className="object-cover"
          draggable={false}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        /* Lucide icon fallback: shows if the image is missing or fails to load */
        <span className="absolute inset-0 flex items-center justify-center">
          <DishIcon name={icon} className="h-[34%] w-[34%] text-ink/70" />
        </span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  )
}
