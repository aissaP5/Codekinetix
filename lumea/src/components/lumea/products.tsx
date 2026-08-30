"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBag } from "./bag";
import { useToast } from "./toast";
import { prefersReducedMotion } from "./smooth-scroll";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    no: "01",
    name: "Éclat",
    kind: "Radiance Serum",
    price: 86,
    notes: "Rosehip · Squalane · Stabilised Vitamin C",
    image: "/images/product-serum.png",
    alt: "Amber glass dropper bottle of Éclat radiance serum",
    offset: "lg:mt-24",
  },
  {
    no: "02",
    name: "Céleste",
    kind: "Hydrating Cream",
    price: 68,
    notes: "White Camellia · Ceramides · Oat Lipids",
    image: "/images/product-cream.png",
    alt: "Ivory ceramic jar of Céleste hydrating cream",
    offset: "lg:mt-2",
  },
  {
    no: "03",
    name: "Aube",
    kind: "Facial Oil",
    price: 74,
    notes: "Rose Absolue · Golden Jojoba · Evening Primrose",
    image: "/images/product-oil.png",
    alt: "Blush frosted glass bottle of Aube facial oil",
    offset: "lg:mt-12",
  },
];

export default function Products() {
  const rootRef = useRef<HTMLElement>(null);
  const { addItem, openBag } = useBag();
  const { toast } = useToast();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lite mode: gentle fades
      if (prefersReducedMotion()) {
        gsap.from(".products-head > *", {
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".products-head", start: "top 84%", once: true },
        });
        gsap.from(".product-card", {
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: ".products-grid", start: "top 84%", once: true },
        });
        return;
      }

      gsap.from(".products-head > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".products-head", start: "top 82%", once: true },
      });

      gsap.from(".product-card", {
        y: 90,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: { trigger: ".products-grid", start: "top 80%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleAdd = (product: (typeof PRODUCTS)[number]) => {
    addItem({
      id: product.no,
      name: product.name,
      kind: product.kind,
      price: product.price,
      image: product.image,
    });
    toast({
      title: `${product.name} — ${product.kind}`,
      description: "Added to your bag. Composed in Grasse, shipped with care.",
      image: product.image,
      action: { label: "View bag", onClick: openBag },
    });
  };

  return (
    <section ref={rootRef} id="collection" className="relative py-28 lg:py-40">
      <div className="container-lumea">
        <header className="products-head mb-16 flex flex-wrap items-end justify-between gap-8 lg:mb-24">
          <div>
            <p className="eyebrow">The Collection — N°01–03</p>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-light leading-[1.02] text-cocoa">
              Composed,
              <br />
              <em className="italic text-clay">not manufactured.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-taupe">
            Three formulas. Nothing more. Each one earns its place on your
            shelf — and on your skin.
          </p>
        </header>

        <div className="products-grid grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {PRODUCTS.map((product) => (
            <article key={product.no} className={cn("product-card group", product.offset)}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-linen">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream/85 px-3.5 py-1.5 text-[9px] tracking-[0.25em] text-cocoa backdrop-blur-sm">
                  N°{product.no}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className="absolute inset-x-5 bottom-5 translate-y-[150%] rounded-full bg-cream/95 py-3.5 text-[9px] uppercase tracking-[0.3em] text-cocoa opacity-0 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-cocoa hover:text-cream group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                >
                  Add to bag — €{product.price}
                </button>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-[1.7rem] leading-none text-cocoa">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-taupe">
                    {product.kind}
                  </p>
                </div>
                <p className="font-display text-xl text-cocoa">€{product.price}</p>
              </div>
              <p className="mt-3 text-xs leading-6 text-taupe/90">{product.notes}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
