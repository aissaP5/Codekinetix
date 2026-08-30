"use client";

import { forwardRef } from "react";
import { BURGER_LAYERS, BURGER_WINDOW } from "@/lib/burger";

interface BurgerStackProps {
  className?: string;
}

/**
 * The six physical burger layers rendered inside a shared aspect-ratio window.
 * Stacked at Z=0 they reconstruct the original burger pixel-perfectly.
 * Animate [data-layer] elements with GSAP to explode / rotate / float.
 */
export const BurgerStack = forwardRef<HTMLDivElement, BurgerStackProps>(
  function BurgerStack({ className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`burger-scene relative ${className}`}
        style={{ aspectRatio: `${BURGER_WINDOW.w} / ${BURGER_WINDOW.h}` }}
        aria-label="SMASH'D burger"
      >
        {BURGER_LAYERS.map((layer) => (
          <div
            key={layer.name}
            data-layer={layer.name}
            className="burger-layer"
            style={{
              left: `${layer.left}%`,
              top: `${layer.top}%`,
              width: `${layer.width}%`,
              height: `${layer.height}%`,
            }}
          >
            <img
              src={layer.src}
              alt={layer.label}
              draggable={false}
              fetchPriority="high"
            />
          </div>
        ))}
      </div>
    );
  }
);
