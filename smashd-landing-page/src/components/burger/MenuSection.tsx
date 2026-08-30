"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MENU_ITEMS } from "@/lib/burger";

export function MenuSection() {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview) return;
    if (window.matchMedia("(hover: none)").matches) return;

    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0, rotate: -5 });

    const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    if (active !== null) {
      gsap.to(preview, { autoAlpha: 1, scale: 1, rotate: -3, duration: 0.45, ease: "power3.out" });
    } else {
      gsap.to(preview, { autoAlpha: 0, scale: 0.6, rotate: -5, duration: 0.35, ease: "power3.in" });
    }
  }, [active]);

  return (
    <section ref={rootRef} id="menu" className="relative py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="menu-header flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember mb-4">
              (Pick your fighter)
            </p>
            <h2 className="font-display leading-[0.9] text-[clamp(3rem,10vw,10rem)] text-foreground">
              THE LINEUP
            </h2>
          </div>
          <p className="font-sans text-sm text-foreground/50 max-w-xs leading-relaxed">
            Four burgers. One plancha. Zero weak links. Hover a name — meet
            your dinner.
          </p>
        </div>

        {/* items */}
        <ul className="border-t border-line" onMouseLeave={() => setActive(null)}>
          {MENU_ITEMS.map((item, i) => (
            <li key={item.name} className="border-b border-line">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="menu-row group w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_1fr_auto] items-center gap-4 md:gap-8 py-7 md:py-9 text-left transition-colors duration-500 hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] outline-none px-2 md:px-4 rounded-sm"
                data-cursor="EAT"
              >
                <span className="font-sans text-xs md:text-sm text-smoke tracking-widest">
                  0{i + 1}
                </span>
                <span className="menu-name font-display text-[clamp(1.5rem,4.5vw,3.8rem)] leading-none text-foreground transition-all duration-500 group-hover:text-ember group-hover:translate-x-3 md:group-hover:translate-x-5">
                  {item.name}
                </span>
                <span className="hidden md:block font-sans text-sm text-foreground/45 transition-colors duration-500 group-hover:text-foreground/70">
                  {item.desc}
                </span>
                <span className="font-display text-xl md:text-3xl text-foreground/80 transition-colors duration-500 group-hover:text-ember">
                  {item.price}
                </span>
                {/* mobile thumb */}
                <span className="md:hidden col-span-full block mt-2 overflow-hidden rounded-lg border border-line">
                  <img src={item.img} alt={item.name} className="w-full h-32 object-cover block" loading="lazy" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-smoke mt-8 text-center">
          All burgers served on butter-toasted brioche · add smash fries +$4
        </p>
      </div>

      {/* floating hover preview (desktop) */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 z-[70] w-[280px] lg:w-[330px] pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-line shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85)]">
          {MENU_ITEMS.map((item, i) => (
            <img
              key={item.name}
              src={item.img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                active === i ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              loading="lazy"
              draggable={false}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,7,5,0.55), transparent 45%)",
            }}
          />
          {active !== null && (
            <span className="absolute bottom-3 left-4 font-display text-lg text-foreground">
              {MENU_ITEMS[active].price}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
