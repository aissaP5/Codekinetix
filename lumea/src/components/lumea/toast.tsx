"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { X } from "lucide-react";
import { prefersReducedMotion } from "./smooth-scroll";

const TOAST_DURATION = 4200;

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  title: string;
  description?: string;
  image?: string;
  action?: ToastAction;
}

interface ToastData extends ToastOptions {
  id: number;
  leaving: boolean;
}

const ToastContext = createContext<{ toast: (t: ToastOptions) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
  }, []);

  const toast = useCallback(
    (t: ToastOptions) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev.slice(-2), { ...t, id, leaving: false }]);
      const timer = setTimeout(() => dismiss(id), TOAST_DURATION);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-5 bottom-5 z-[95] flex flex-col items-end sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={dismiss} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  data,
  onDismiss,
  onRemove,
}: {
  data: ToastData;
  onDismiss: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ——— GSAP entrance: rise, unclip, deblur ———
  useEffect(() => {
    // Lite mode: opacity-only entrance, progress hairline still runs
    if (prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.55, ease: "power2.out" }
        );
        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleX: 1 },
            { scaleX: 0, duration: TOAST_DURATION / 1000, ease: "none" }
          );
        }
      }, ref);
      return () => ctx.revert();
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 36, opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power4.out",
        }
      );
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 1 },
          { scaleX: 0, duration: TOAST_DURATION / 1000, ease: "none" }
        );
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  // ——— GSAP exit: slide away and collapse so the stack reflows ———
  useEffect(() => {
    if (!data.leaving) return;
    if (prefersReducedMotion()) {
      // Lite mode: quick fade, then remove
      const ctx = gsap.context(() => {
        gsap.to(ref.current, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => onRemove(data.id),
        });
      }, ref);
      return () => ctx.revert();
    }
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        x: 80,
        opacity: 0,
        height: 0,
        marginBottom: 0,
        duration: 0.55,
        ease: "power3.in",
        onComplete: () => onRemove(data.id),
      });
    }, ref);
    return () => ctx.revert();
  }, [data.leaving, data.id, onRemove]);

  return (
    <div
      ref={ref}
      role="status"
      className="pointer-events-auto relative mb-3 w-full overflow-hidden rounded-[10px] bg-cocoa text-cream shadow-[0_30px_60px_-24px_rgba(45,36,27,0.6)]"
    >
      <div className="flex items-start gap-4 p-4 pr-3">
        {data.image && (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md">
            <Image src={data.image} alt="" fill sizes="56px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-display text-lg leading-snug">{data.title}</p>
          {data.description && (
            <p className="mt-1 text-xs leading-5 text-cream/65">{data.description}</p>
          )}
          {data.action && (
            <button
              type="button"
              onClick={() => {
                data.action?.onClick();
                onDismiss(data.id);
              }}
              className="nav-link mt-2.5 text-[10px] uppercase tracking-[0.28em] text-blush"
            >
              {data.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(data.id)}
          aria-label="Dismiss notification"
          className="grid size-8 shrink-0 place-items-center rounded-full text-cream/50 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <X className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>
      <div
        ref={progressRef}
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-rose/90"
      />
    </div>
  );
}
