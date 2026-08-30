'use client'

import { useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

/* ============ Comic scroll progress bar (site-wide) ============ */

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      }
    )
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[7px] border-b-[3px] border-ink bg-pulp"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-comic-yellow"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

/* ============ Back-to-top comic button (appears after the fold) ============ */

export function BackToTop() {
  const [show, setShow] = useState(false)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 700,
      end: 'max',
      onToggle: (self) => setShow(self.isActive),
    })
  })

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-comic-yellow text-ink shadow-comic-sm transition-all hover:-translate-y-0.5 hover:animate-wiggle active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:bottom-8 lg:right-8',
        show ? 'ono-pop' : 'pointer-events-none scale-0 opacity-0'
      )}
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  )
}
