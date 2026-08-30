"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useBag } from "./bag";
import { getLenis, prefersReducedMotion } from "./smooth-scroll";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Ritual", href: "#ritual" },
  { label: "Journal", href: "#journal" },
  { label: "The List", href: "#list" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openBag } = useBag();
  const menuRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bag badge pop
  useEffect(() => {
    if (count > 0 && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4 },
        { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.45)" }
      );
    }
  }, [count]);

  // Mobile menu animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      getLenis()?.stop();
      if (prefersReducedMotion()) {
        // Lite mode: fade, no clip wipe
        gsap
          .timeline()
          .set(menu, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)" })
          .fromTo(
            menu.querySelectorAll(".menu-link, .menu-meta"),
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }
          );
      } else {
        gsap
          .timeline()
          .set(menu, { autoAlpha: 1 })
          .fromTo(
            menu,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 0.85, ease: "power4.inOut" }
          )
          .fromTo(
            menu.querySelectorAll(".menu-link"),
            { y: 56, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07 },
            "-=0.35"
          )
          .fromTo(
            menu.querySelectorAll(".menu-meta"),
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.3"
          );
      }
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => getLenis()?.start(),
      });
    }
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          scrolled
            ? "border-b border-cocoa/10 bg-cream/85 py-3 backdrop-blur-md"
            : "bg-transparent py-5"
        )}
      >
        <nav
          aria-label="Primary"
          className="container-lumea grid grid-cols-3 items-center"
        >
          {/* Left — desktop links / mobile hamburger */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-cocoa/5 lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
            <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="nav-link text-[10px] uppercase tracking-[0.28em] text-cocoa/80 transition-colors hover:text-cocoa"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Center — wordmark */}
          <a
            href="#top"
            className="justify-self-center font-display text-[1.35rem] tracking-[0.42em] text-cocoa lg:text-2xl"
            onClick={(e) => {
              e.preventDefault();
              const lenis = getLenis();
              if (lenis) {
                lenis.start();
                lenis.scrollTo(0, { duration: 1.6, force: true });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            LUMÉA
          </a>

          {/* Right — bag */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={openBag}
              aria-label="Open shopping bag"
              className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-cocoa/5"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {count > 0 && (
                <span
                  ref={badgeRef}
                  className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-clay text-[9px] font-medium text-cream"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        ref={menuRef}
        className="invisible fixed inset-0 z-[70] flex flex-col bg-cocoa text-cream"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <div className="container-lumea flex items-center justify-between py-5">
          <span className="font-display text-xl tracking-[0.42em]">LUMÉA</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-cream/10"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
          <ul className="flex flex-col gap-2">
            {LINKS.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="menu-link group flex items-baseline gap-4 py-2"
                >
                  <span className="text-[10px] tracking-[0.3em] text-cream/40">
                    0{i + 1}
                  </span>
                  <span className="font-display text-5xl leading-tight transition-colors group-hover:text-blush">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-lumea flex items-center justify-between pb-10 text-[9px] tracking-[0.3em] text-cream/50">
          <p className="menu-meta">EST. 2025</p>
          <p className="menu-meta">GRASSE, FRANCE</p>
        </div>
      </div>
    </>
  );
}
