"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import Reveal from "./reveal";

const FAQS = [
  {
    q: "Where does LUMÉA ship?",
    a: "Worldwide, from our atelier in Grasse. European orders arrive in two to four days, everywhere else within five to nine. Every parcel travels wrapped in silk paper — and one tree is planted per order, quietly.",
  },
  {
    q: "Is LUMÉA suitable for sensitive skin?",
    a: "Each formula is patch-tested on reactive skin and composed without essential-oil fragrance load. That said, skin is personal — we always suggest a 48-hour patch test on the inner arm, and our team is one quiet email away.",
  },
  {
    q: "What is your return policy?",
    a: "Thirty days, opened or not. Skincare should be tried on your skin, not trusted from a description. If a formula does not feel right, we refund it and ask only that you tell us why.",
  },
  {
    q: "Are the formulas vegan?",
    a: "Entirely. No animal derivatives, no animal testing, no exceptions — certified by Leaping Bunny and by our own conscience. Our beeswax-free balm is the proof we are proudest of.",
  },
  {
    q: "How should I layer the collection?",
    a: "Thinnest to richest: Tendre to cleanse, Éclat to treat, Céleste to seal, Aube wherever your skin asks for more. Morning and evening, three movements — never more.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rootRef = useRef<HTMLElement>(null);

  // GSAP height tweens — the accordion breathes rather than snaps
  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        height: open === i ? "auto" : 0,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          if (open === i) gsap.set(el, { height: "auto" });
        },
      });
    });
  }, [open]);

  return (
    <section ref={rootRef} id="faq" className="relative py-28 lg:py-40">
      <div className="container-lumea grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow">Quiet answers</p>
              <h2 className="mt-6 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[1.03] text-cocoa">
                Everything,
                <br />
                <em className="italic text-clay">gently asked.</em>
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-7 text-taupe">
                The questions we hear most — answered the way we answer
                everything: briefly, honestly, and without asterisks.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <div className="border-t border-cocoa/15">
              {FAQS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="border-b border-cocoa/10">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                    >
                      <span
                        className={`font-display text-xl leading-snug transition-colors duration-300 group-hover:text-clay lg:text-2xl ${
                          isOpen ? "text-clay" : "text-cocoa"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                          isOpen
                            ? "rotate-45 border-clay bg-clay text-cream"
                            : "border-cocoa/15 text-cocoa"
                        }`}
                      >
                        <Plus className="size-4" strokeWidth={1.5} />
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      ref={(el) => {
                        contentRefs.current[i] = el;
                      }}
                      className="h-0 overflow-hidden"
                    >
                      <p className="max-w-xl pb-8 text-sm leading-8 text-taupe">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
