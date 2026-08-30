"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { X, Minus, Plus } from "lucide-react";
import { useBag } from "./bag";
import { useToast } from "./toast";
import { getLenis, prefersReducedMotion } from "./smooth-scroll";

export default function BagDrawer() {
  const { items, count, subtotal, isOpen, closeBag, setQty, removeItem } = useBag();
  const { toast } = useToast();
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Park everything off-screen on mount
  useEffect(() => {
    gsap.set(rootRef.current, { autoAlpha: 0 });
    gsap.set(panelRef.current, { x: "100%" });
  }, []);

  // ——— GSAP drawer choreography ———
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!root || !backdrop || !panel) return;

    if (prefersReducedMotion()) {
      // Lite mode: simple fade, no slide
      if (isOpen) {
        getLenis()?.stop();
        gsap
          .timeline()
          .set(root, { autoAlpha: 1 })
          .set(panel, { x: "0%" })
          .fromTo(
            backdrop,
            { opacity: 0 },
            { opacity: 1, duration: 0.45, ease: "power2.out" }
          )
          .fromTo(
            root.querySelectorAll(".bag-anim"),
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
            0.1
          );
      } else {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
        });
        getLenis()?.start();
      }
      return;
    }

    if (isOpen) {
      getLenis()?.stop();
      gsap
        .timeline()
        .set(root, { autoAlpha: 1 })
        .fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: 0.55, ease: "power2.out" },
          0
        )
        .fromTo(
          panel,
          { x: "100%" },
          { x: "0%", duration: 0.95, ease: "power4.out" },
          0.04
        )
        .fromTo(
          root.querySelectorAll(".bag-anim"),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.06 },
          0.32
        );
    } else {
      gsap
        .timeline({ onComplete: () => gsap.set(root, { autoAlpha: 0 }) })
        .to(panel, { x: "100%", duration: 0.6, ease: "power3.in" }, 0)
        .to(backdrop, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.08);
      getLenis()?.start();
    }
  }, [isOpen]);

  // Escape closes the drawer
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBag]);

  const handleCheckout = () => {
    closeBag();
    toast({
      title: "The atelier is preparing",
      description:
        "Checkout opens with our first release. Your selection is noted with care.",
    });
  };

  const goToCollection = () => {
    closeBag();
    window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo("#collection", { offset: -72, duration: 1.5 });
      } else {
        document
          .querySelector("#collection")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <div ref={rootRef} className="invisible fixed inset-0 z-[90]" aria-hidden={!isOpen}>
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-cocoa/45 opacity-0 backdrop-blur-[6px]"
        onClick={closeBag}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-[-30px_0_80px_-40px_rgba(45,36,27,0.5)]"
      >
        <header className="bag-anim flex items-center justify-between border-b border-cocoa/10 px-7 py-6">
          <div>
            <p className="eyebrow">Your Bag</p>
            <p className="mt-2 font-display text-2xl leading-none text-cocoa">
              {count === 0 ? "Empty" : `${count} ${count === 1 ? "piece" : "pieces"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeBag}
            aria-label="Close bag"
            className="grid size-11 place-items-center rounded-full border border-cocoa/15 text-cocoa transition-colors duration-300 hover:bg-cocoa hover:text-cream"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="bag-anim flex flex-1 flex-col items-center justify-center gap-6 px-10 text-center">
            <p className="font-display text-3xl italic text-cocoa">
              Your bag is empty
            </p>
            <p className="max-w-[250px] text-sm leading-7 text-taupe">
              Three formulas await — each composed to earn its place on your
              shelf.
            </p>
            <button
              type="button"
              onClick={goToCollection}
              className="nav-link text-[10px] uppercase tracking-[0.3em] text-cocoa"
            >
              Discover the collection
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-7"
              data-lenis-prevent
            >
              <ul className="flex flex-col divide-y divide-cocoa/10">
                {items.map((item) => (
                  <li key={item.id} className="bag-anim flex gap-5 py-6">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-linen">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-xl leading-none text-cocoa">
                            {item.name}
                          </p>
                          <p className="mt-1.5 text-[9px] uppercase tracking-[0.25em] text-taupe">
                            {item.kind}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="grid size-8 shrink-0 place-items-center rounded-full text-taupe transition-colors hover:bg-cocoa/5 hover:text-cocoa"
                        >
                          <X className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="grid size-8 place-items-center rounded-full border border-cocoa/15 text-cocoa transition-colors hover:border-cocoa/45"
                          >
                            <Minus className="size-3.5" strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums text-cocoa">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="grid size-8 place-items-center rounded-full border border-cocoa/15 text-cocoa transition-colors hover:border-cocoa/45"
                          >
                            <Plus className="size-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="font-display text-lg text-cocoa">
                          €{item.price * item.qty}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="bag-anim border-t border-cocoa/10 px-7 py-6">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">
                  Subtotal
                </p>
                <p className="font-display text-2xl text-cocoa">€{subtotal}</p>
              </div>
              <p className="mt-2 text-[10px] leading-5 text-taupe/70">
                Complimentary shipping &amp; returns — wrapped in silk paper.
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-5 w-full rounded-full bg-cocoa py-4 text-[10px] uppercase tracking-[0.3em] text-cream transition-colors duration-500 hover:bg-espresso"
              >
                Complete the ritual
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
