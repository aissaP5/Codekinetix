"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ————————————————— in-view hook + reveal wrappers ————————————————— */

export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`rv ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function RevealImage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView(0.12);
  return (
    <div
      ref={ref}
      className={`rv-img ${inView ? "is-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* Headline with masked line-by-line entrance */
export function Headline({
  lines,
  className = "",
  inView,
  delayStep = 95,
}: {
  lines: ReactNode[];
  className?: string;
  inView?: boolean;
  delayStep?: number;
}) {
  const { ref, inView: ownIn } = useInView(0.15);
  const shown = inView ?? ownIn;
  return (
    <span ref={ref} className={`headline ${shown ? "is-in" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ transitionDelay: `${i * delayStep}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ————————————————— the tooth ————————————————— */

/* Molar silhouette, reads at any size. Inherits currentColor. */
export function ToothGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <path
        d="M20 6.5 C16.5 2.5 9 3.5 7.5 10 C6.5 15 9 19 10 24 C11 30 10.5 38 14.5 40.5 C17.5 42.5 18.5 34 20 30 C21.5 34 22.5 42.5 25.5 40.5 C29.5 38 29 30 30 24 C31 19 33.5 15 32.5 10 C31 3.5 23.5 2.5 20 6.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A row of teeth — the dental-chart progress marker */
export function ToothChart({
  filled = 3,
  total = 5,
  className = "",
}: {
  filled?: number;
  total?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-end gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: total }).map((_, i) => (
        <ToothGlyph
          key={i}
          className={`w-[13px] ${i < filled ? "[&_path]:fill-current [&_path]:stroke-0 opacity-90" : "opacity-35"}`}
        />
      ))}
    </span>
  );
}

/* ————————————————— plate header — the atlas running head ————————————————— */

export function PlateHead({
  index,
  title,
  fig,
  dark = false,
}: {
  index: string;
  title: string;
  fig: string;
  dark?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={`border-y ${dark ? "border-line-dark" : "border-line-strong"}`}
      >
        <div className="flex items-stretch">
          <div
            className={`${dark ? "bg-verm text-paper" : "bg-ink text-paper"} px-3.5 md:px-5 py-3.5 flex items-center label shrink-0`}
          >
            PLATE&nbsp;{index}
          </div>
          <div className="flex-1 px-4 md:px-6 py-3.5 flex items-center">
            <span className="disp text-[13px] md:text-[17px] tracking-[0.02em]">
              {title}
            </span>
          </div>
          <div
            className={`hidden md:flex px-5 py-3.5 items-center label ${dark ? "text-paper/50" : "text-ink/45"}`}
          >
            {fig}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* fig. caption chip that sits on images */
export function FigChip({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`label px-2.5 py-2 inline-block ${
        dark ? "bg-ink text-paper" : "bg-paper text-ink/80"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* ————————————————— the seal ————————————————— */

/* Round accreditation seal with a text ring, drawn in SVG */
export function Seal({
  top,
  center,
  bottom,
  className = "",
}: {
  top: string;
  center: string;
  bottom: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path
          id={`seal-ring-${center.replace(/[^a-z0-9]/gi, "")}`}
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
        />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* dotted ring between */}
      <circle
        cx="60"
        cy="60"
        r="44.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1.5 4"
      />
      <text
        x="60"
        y="66.5"
        textAnchor="middle"
        className="fill-current"
        style={{
          fontFamily: "var(--font-disp)",
          fontSize: "21px",
          letterSpacing: "0.02em",
        }}
      >
        {center}
      </text>
      <text
        fill="currentColor"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "8.2px",
          letterSpacing: "2.6px",
        }}
      >
        <textPath href={`#seal-ring-${center.replace(/[^a-z0-9]/gi, "")}`} startOffset="2%">
          {top}
        </textPath>
      </text>
      <text
        x="60"
        y="82"
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "6.4px",
          letterSpacing: "1.8px",
        }}
      >
        {bottom}
      </text>
    </svg>
  );
}
