"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  outlineEvery?: number;
}

/** Seamless infinite marquee — content duplicated for a -50% loop. */
export function Marquee({
  items,
  speed = 28,
  reverse = false,
  className = "",
  itemClassName = "",
  outlineEvery = 0,
}: MarqueeProps) {
  const group = (
    <>
      {Array.from({ length: 4 }).map((_, rep) =>
        items.map((item, i) => (
          <span key={`${rep}-${i}`} className="flex items-center shrink-0">
            <span
              className={`font-display text-[7vw] md:text-[4.2vw] leading-none whitespace-nowrap px-6 md:px-8 ${
                outlineEvery > 0 && (i + rep) % outlineEvery === 1
                  ? "text-stroke"
                  : ""
              } ${itemClassName}`}
            >
              {item}
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-[4vw] h-[4vw] md:w-[2.2vw] md:h-[2.2vw] shrink-0 text-ember"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.5 0.7c2.6 3.2 2.1 5.3.3 7 2.6-1 5.2-.4 6.9 2.4-3.3.4-4.6 2-4.4 4.7-2.6-1.7-3.4-4.1-2.4-6.7-2.7 1.4-5.2 1-6.9-1.7 3.3-.4 4.9-1.7 5.4-4.3-2.3 1.1-4.4.7-6.2-1.4 2.9-1.1 4-2.7 3.7-5.3 1.6 1.9 3 2.3 4.4 1.3-.7-1.4-.7-2.8-.8-4 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5z" />
              <circle cx="12" cy="14.5" r="3.4" />
            </svg>
          </span>
        ))
      )}
    </>
  );

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`marquee-track flex w-max items-center ${reverse ? "reverse" : ""}`}
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        <div className="flex items-center">{group}</div>
        <div className="flex items-center">{group}</div>
      </div>
    </div>
  );
}
