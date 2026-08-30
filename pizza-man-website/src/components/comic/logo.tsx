import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Pizza-Man! official emblem — ROUND 15 redesign (full CARTOON-COMIC mascot):
 * a wobbly hand-drawn yellow sticker badge with a chubby pizza-slice hero
 * bursting out of it — HUGE expressive face (white domino mask, big sparkly
 * eyes, wide open grin with tongue), purple cape, melting cheese drips,
 * ink action sparks and comic print stars.
 *
 * Design rules: thick bold ink outlines (4.5–5), big simple shapes, high
 * contrast, ZERO thin details → stays loud and readable at favicon size.
 *
 * Pure static coordinates (no Math at render time) → hydration-safe.
 */
export function PizzaManLogo({
  className,
  title = 'Pizza-Man! mascot — a grinning pizza slice superhero bursting out of a yellow sticker badge',
}: {
  className?: string
  title?: string
}) {
  const id = useId()

  return (
    <svg viewBox="0 0 120 120" className={cn('block', className)} role="img" aria-label={title}>
      <defs>
        {/* Comic print halftone, whispered onto the badge */}
        <pattern id={`${id}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#141414" opacity="0.1" />
        </pattern>
      </defs>

      {/* Wobbly hand-drawn sticker badge */}
      <path
        d="M60 12 C 78 11, 95 20, 106 34 C 113 44, 114 58, 110 72 C 105 89, 92 103, 74 109 C 64 112, 52 112, 42 108 C 27 102, 14 90, 10 74 C 6 60, 9 44, 18 32 C 28 18, 44 13, 60 12 Z"
        fill="#ffd100"
        stroke="#141414"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M60 12 C 78 11, 95 20, 106 34 C 113 44, 114 58, 110 72 C 105 89, 92 103, 74 109 C 64 112, 52 112, 42 108 C 27 102, 14 90, 10 74 C 6 60, 9 44, 18 32 C 28 18, 44 13, 60 12 Z"
        fill={`url(#${id}-dots)`}
      />

      {/* Ink action sparks — the slice bursts out of the badge */}
      <g stroke="#141414" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M27 25 L34 34" />
        <path d="M49 12 L51 23.5" />
        <path d="M69 14 L65.5 25" />
      </g>

      {/* Comic print stars riding the badge edge */}
      <g stroke="#141414" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M92 86.5 L93.4 89.6 L96.5 91 L93.4 92.4 L92 95.5 L90.6 92.4 L87.5 91 L90.6 89.6 Z" fill="#ef3e36" />
        <path d="M101 33.5 L102.5 36.5 L105.5 38 L102.5 39.5 L101 42.5 L99.5 39.5 L96.5 38 L99.5 36.5 Z" fill="#00b8a9" />
      </g>

      {/* The slice hero — nudged into the badge, tilted for bounce */}
      <g transform="translate(-2 3) rotate(-6 60 62)">
        {/* Purple superhero cape — symmetric wings, scalloped hem */}
        <path
          d="M38 50 C 24 56, 16 68, 18 81 Q 22 89, 30 84 Q 36 91, 45 87 Q 52 94, 60 93 Q 68 94, 75 87 Q 84 91, 90 84 Q 98 89, 100 80 C 103 67, 96 56, 82 50 C 68 43, 52 43, 38 50 Z"
          fill="#9b5de5"
          stroke="#141414"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Cheese body (rounded triangle, tip down) */}
        <path
          d="M34 50 L86 50 L65.5 94 C 63.5 98.5, 56.5 98.5, 54.5 94 Z"
          fill="#ffe066"
          stroke="#141414"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Melting cheese drips under the crust, clear of the mask */}
        <g fill="#ffe066" stroke="#141414" strokeWidth="2.8" strokeLinejoin="round">
          <path d="M35 52.5 C 34.5 60, 40.5 60, 40 52.5 Z" />
          <path d="M80.5 52.5 C 80.1 58.5, 85.7 58.5, 85.3 52.5 Z" />
        </g>

        {/* Crust */}
        <rect x="30.5" y="36.5" width="59" height="17" rx="8.5" fill="#e8a33d" stroke="#141414" strokeWidth="5" />
        <path d="M38 42.5 C 44 40.5, 52 40.5, 58 42.5" fill="none" stroke="#fffdf2" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* White domino mask */}
        <path
          d="M39 61 C 44 55.8, 54 54.6, 60 56.2 C 66 54.6, 76 55.8, 81 61 C 82.6 65.6, 79.4 70, 73.6 70.9 C 68.2 71.8, 63.4 69.4, 60 67.4 C 56.6 69.4, 51.8 71.8, 46.4 70.9 C 40.6 70, 37.4 65.6, 39 61 Z"
          fill="#fffdf2"
          stroke="#141414"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* BIG sparkly cartoon eyes */}
        <ellipse cx="49.5" cy="62" rx="4.9" ry="5.7" fill="#fffdf2" stroke="#141414" strokeWidth="2.2" />
        <circle cx="50.3" cy="62.6" r="2.6" fill="#141414" />
        <circle cx="48.7" cy="60.7" r="1" fill="#fffdf2" />
        <ellipse cx="70.5" cy="62" rx="4.9" ry="5.7" fill="#fffdf2" stroke="#141414" strokeWidth="2.2" />
        <circle cx="69.7" cy="62.6" r="2.6" fill="#141414" />
        <circle cx="71.3" cy="60.7" r="1" fill="#fffdf2" />

        {/* Wide open hero grin + tongue */}
        <path d="M50.5 74 C 53 82.5, 67 82.5, 69.5 74 C 63.5 77, 56.5 77, 50.5 74 Z" fill="#141414" />
        <path d="M55.5 79.6 C 57 77.6, 63 77.6, 64.5 79.6 C 62.5 81.4, 57.5 81.4, 55.5 79.6 Z" fill="#ff5da2" />

        {/* Pepperoni */}
        <circle cx="55.5" cy="86.5" r="3.2" fill="#ef3e36" stroke="#141414" strokeWidth="2.2" />
        <circle cx="65" cy="85.5" r="3" fill="#ef3e36" stroke="#141414" strokeWidth="2.2" />
      </g>
    </svg>
  )
}

/**
 * Emblem + wordmark lockup (kept for convenience).
 */
export function PizzaManBrand({
  className,
  emblemClassName,
  wordmarkClassName,
}: {
  className?: string
  emblemClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={cn('group inline-flex items-center gap-2.5', className)}>
      <PizzaManLogo className={cn('h-11 w-11 rotate-3 drop-shadow-[3px_3px_0_var(--color-ink)] transition-transform duration-200 group-hover:rotate-12 group-hover:scale-105', emblemClassName)} />
      <span className={cn('comic-title text-2xl text-ink', wordmarkClassName)}>
        Pizza-Man<span className="text-comic-red">!</span>
      </span>
    </span>
  )
}
