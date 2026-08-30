"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface OrderToastData {
  id: number;
  title: string;
  desc: string;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: OrderToastData;
  onDismiss: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const bar = barRef.current;
    if (!el || !bar) return;

    const DURATION = 4200;
    const tl = gsap.timeline({
      onComplete: () => onDismiss(toast.id),
    });

    tl.fromTo(
      el,
      { y: 90, autoAlpha: 0, scale: 0.92 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, ease: "back.out(1.8)" }
    )
      .fromTo(
        bar,
        { scaleX: 1 },
        { scaleX: 0, duration: DURATION / 1000 - 1, ease: "none" },
        0.6
      )
      .to(el, { y: 14, autoAlpha: 0, scale: 0.95, duration: 0.4, ease: "power2.in" });

    return () => {
      tl.kill();
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      ref={ref}
      role="status"
      className="relative w-[min(92vw,400px)] rounded-xl border border-ember/40 bg-[#151009]/95 backdrop-blur-md shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9),0_0_40px_-12px_rgba(255,92,31,0.35)] overflow-hidden opacity-0"
    >
      <div className="flex items-start gap-3.5 p-4 pr-10">
        <span className="relative mt-0.5 shrink-0 w-9 h-9 rounded-full bg-ember/15 border border-ember/50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 w-[18px] h-[18px] text-ember" fill="currentColor" aria-hidden="true">
            <path d="M13.5 0.7c2.6 3.2 2.1 5.3.3 7 2.6-1 5.2-.4 6.9 2.4-3.3.4-4.6 2-4.4 4.7-2.6-1.7-3.4-4.1-2.4-6.7-2.7 1.4-5.2 1-6.9-1.7 3.3-.4 4.9-1.7 5.4-4.3-2.3 1.1-4.4.7-6.2-1.4 2.9-1.1 4-2.7 3.7-5.3 1.6 1.9 3 2.3 4.4 1.3-.7-1.4-.7-2.8-.8-4 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5z" />
            <circle cx="12" cy="14.5" r="3.4" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm tracking-wide text-foreground leading-tight">
            {toast.title}
          </p>
          <p className="font-sans text-xs text-smoke mt-1 leading-snug">{toast.desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-smoke hover:text-foreground hover:bg-foreground/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <span className="absolute bottom-0 left-0 h-[3px] w-full bg-ember/80 origin-left block" ref={barRef} />
    </div>
  );
}

export function OrderToast({
  toasts,
  onDismiss,
}: {
  toasts: OrderToastData[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[95] flex flex-col items-center gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
