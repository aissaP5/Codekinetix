"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "./Magnetic";
import { Marquee } from "./Marquee";
import { OrderToast, type OrderToastData } from "./OrderToast";

gsap.registerPlugin(ScrollTrigger);

const MENU_SHORT = [
  "The Classic Smash",
  "Tower of Power",
  "Truffle Shroom",
  "Dirty Sauce",
];

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [fired, setFired] = useState(false);
  const [toasts, setToasts] = useState<OrderToastData[]>([]);
  const orderCount = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-title .char",
        { yPercent: 115, rotate: 5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: ".cta-title", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".cta-sub",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta-title", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".footer-row",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".footer-grid", start: "top 92%" },
        }
      );

      /* giant title letters scatter on hover */
      gsap.utils.toArray<HTMLElement>(".cta-title .char").forEach((char) => {
        char.addEventListener("mouseenter", () => {
          if (char.textContent === " ") return;
          gsap.to(char, {
            y: () => gsap.utils.random(-26, 26),
            x: () => gsap.utils.random(-14, 14),
            rotation: () => gsap.utils.random(-14, 14),
            duration: 0.4,
            ease: "back.out(3)",
          });
          gsap.to(char, {
            y: 0,
            x: 0,
            rotation: 0,
            duration: 0.9,
            delay: 0.45,
            ease: "elastic.out(1, 0.35)",
          });
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fireOrder = useCallback(() => {
    if (fired) return;
    setFired(true);
    orderCount.current += 1;

    const pick = MENU_SHORT[Math.floor(Math.random() * MENU_SHORT.length)];
    const mins = 8 + Math.floor(Math.random() * 8);
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `ORDER #${String(100 + orderCount.current)} FIRED TO THE KITCHEN`,
        desc: `${pick} · ready in ~${mins} min — listen for your name.`,
      },
    ]);

    /* button punch */
    const btn = btnRef.current;
    if (btn) {
      gsap
        .timeline()
        .to(btn, { scale: 0.88, duration: 0.09, ease: "power2.in" })
        .to(btn, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    }

    window.setTimeout(() => setFired(false), 3600);
  }, [fired]);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string | number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const text = "GET SMASH'D";

  return (
    <footer ref={rootRef} id="order" className="relative overflow-hidden">
      {/* top marquee */}
      <div className="border-y border-line bg-ink/60">
        <Marquee
          items={["Order Now", "Kitchen Open Till 2AM", "Smashed To Order", "Get In The Stack"]}
          speed={22}
          reverse
          outlineEvery={2}
          className="py-4 md:py-6"
        />
      </div>

      {/* CTA */}
      <div className="relative py-28 md:py-40 px-5 text-center">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,92,31,0.14), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <h2 className="cta-title font-display leading-[0.88] text-[clamp(3.4rem,14vw,15rem)] text-foreground">
          <span className="block overflow-hidden pb-1">
            {text.split("").map((c, i) => (
              <span key={i} className="char inline-block will-change-transform">
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </span>
        </h2>
        <p className="cta-sub font-sans text-sm md:text-base text-foreground/60 max-w-md mx-auto mt-6 leading-relaxed">
          The stack is waiting. The plancha is hot. Your move.
        </p>

        <div className="cta-sub mt-12 flex justify-center">
          <Magnetic
            as="button"
            ref={btnRef}
            onClick={fireOrder}
            data-cursor={fired ? "ON IT" : "LET'S GO"}
            aria-live="polite"
            className={`group relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center font-sans text-sm font-bold tracking-[0.18em] uppercase transition-colors duration-500 ${
              fired ? "bg-gold text-ink" : "bg-ember text-ink hover:bg-gold"
            }`}
          >
            <span className="flex flex-col items-center gap-1">
              {fired ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Order Fired
                </>
              ) : (
                <>
                  Order Now
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mt-1 group-hover:scale-125 transition-transform duration-500" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 0.7c2.6 3.2 2.1 5.3.3 7 2.6-1 5.2-.4 6.9 2.4-3.3.4-4.6 2-4.4 4.7-2.6-1.7-3.4-4.1-2.4-6.7-2.7 1.4-5.2 1-6.9-1.7 3.3-.4 4.9-1.7 5.4-4.3-2.3 1.1-4.4.7-6.2-1.4 2.9-1.1 4-2.7 3.7-5.3 1.6 1.9 3 2.3 4.4 1.3-.7-1.4-.7-2.8-.8-4 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5 1.3.9 2.4 2.3 3 4 1.1-1.7 1.3-3.3 1-5z" />
                    <circle cx="12" cy="14.5" r="3.4" />
                  </svg>
                </>
              )}
            </span>
            {!fired && (
              <span className="absolute inset-2 rounded-full border border-ink/25 animate-ping [animation-duration:2.4s]" aria-hidden="true" />
            )}
          </Magnetic>
        </div>

        <p className="cta-sub font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-smoke mt-10">
          No payment · no signup · just hunger
        </p>
      </div>

      {/* footer grid */}
      <div className="footer-grid border-t border-line px-5 md:px-10 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="footer-row">
            <p className="font-display text-2xl mb-4">
              SMASH&apos;D<span className="text-ember">.</span>
            </p>
            <p className="font-sans text-xs text-smoke leading-relaxed max-w-[220px]">
              Flame-grilled burger co. Smashing since 2024. No franchises, no
              freezers, no mercy.
            </p>
          </div>
          <div className="footer-row">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke mb-4">Find us</p>
            <ul className="font-sans text-sm text-foreground/75 space-y-2">
              <li>44 Crust Lane</li>
              <li>Meatpacking District</li>
              <li>New grill, NY 10014</li>
            </ul>
          </div>
          <div className="footer-row">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke mb-4">Hours</p>
            <ul className="font-sans text-sm text-foreground/75 space-y-2">
              <li>Mon – Thu · 11am – 12am</li>
              <li>Fri – Sat · 11am – 2am</li>
              <li>Sunday · smashed closed</li>
            </ul>
          </div>
          <div className="footer-row">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke mb-4">Stalk us</p>
            <ul className="font-sans text-sm text-foreground/75 space-y-2">
              {["Instagram", "TikTok", "X / Twitter"].map((s) => (
                <li key={s}>
                  <a href="#top" onClick={toTop} className="hover:text-ember transition-colors" data-cursor="FOLLOW">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-14 md:mt-20 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-smoke">
            © 2026 SMASH&apos;D Burger Co. All rights delicious.
          </p>
          <p className="font-sans text-[11px] text-smoke">
            Built with GSAP &amp; CSS 3D — zero WebGL harmed.
          </p>
          <a
            href="#top"
            onClick={toTop}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-foreground/70 hover:text-ember transition-colors"
            data-cursor="TOP"
          >
            Back to top ↑
          </a>
        </div>
      </div>

      {/* order notifications */}
      <OrderToast toasts={toasts} onDismiss={dismissToast} />
    </footer>
  );
}
