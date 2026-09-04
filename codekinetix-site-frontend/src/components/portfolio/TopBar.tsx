"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useKinetix, type TabId } from "@/lib/store";

const NAV_LINKS = [
  { href: "/works", label: "WORKS", id: "works" as TabId },
  { href: "/about", label: "ABOUT", id: "about" as TabId },
];

export default function TopBar() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const setActiveTab = useKinetix((s) => s.setActiveTab);

  const handleNav = (tabId: TabId) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Magnetic button on desktop pointer
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let base: DOMRect | null = null;
    const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });

    const onEnter = () => {
      base = btn.getBoundingClientRect();
    };
    const onMove = (e: PointerEvent) => {
      if (!base) return;
      xTo((e.clientX - (base.left + base.width / 2)) * 0.35);
      yTo((e.clientY - (base.top + base.height / 2)) * 0.55);
    };
    const onLeave = () => {
      base = null;
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Mobile Menu Animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power4.inOut" }
      );
      gsap.fromTo(
        ".mob-link",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.25, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.45,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-40 flex items-center justify-between gap-3 px-4 sm:px-8 py-3.5 sm:py-4 border-b border-bone/10 bg-void">
        {/* Wordmark */}
        <Link
          href="/"
          onClick={() => handleNav("studio")}
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          aria-label="CodeKinetix home"
        >
          <span className="w-2.5 h-2.5 bg-volt rotate-45 shrink-0 group-hover:scale-125 transition-transform" aria-hidden="true" />
          <span className="font-extrabold type-wide uppercase tracking-tight text-bone text-[15px] sm:text-[17px] leading-none">
            CodeKinetix<sup className="text-volt text-[9px] align-super">®</sup>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-[11px] tracking-[0.2em]" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleNav(link.id)}
                className={`transition-colors uppercase ${
                  isActive
                    ? "text-volt font-bold"
                    : "text-bone/70 hover:text-volt"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          {/* Primary Magnetic CTA */}
          <Link
            ref={ctaRef}
            href="/contact"
            onClick={() => handleNav("contact")}
            className="group flex items-center gap-2 bg-volt text-void font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] px-4 sm:px-5 py-2.5 hover:bg-bone transition-colors duration-300 [-webkit-tap-highlight-color:transparent]"
            aria-label="Start a Project with CodeKinetix"
          >
            START A PROJECT
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
              ↗
            </span>
          </Link>

          {/* Hamburger Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-bone hover:text-volt transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <div className="w-5 flex flex-col items-end gap-1.5">
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "w-5 rotate-45 translate-y-2 bg-volt" : "w-5"
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "w-3"
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "w-5 -rotate-45 -translate-y-2 bg-volt" : "w-4"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-50 bg-void flex-col justify-between p-6 sm:p-12 overflow-y-auto"
        style={{ display: "none", clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="flex items-center justify-between border-b border-bone/10 pb-6">
          <Link
            href="/"
            onClick={() => handleNav("studio")}
            className="flex items-center gap-2.5"
          >
            <span className="w-2.5 h-2.5 bg-volt rotate-45" />
            <span className="font-extrabold type-wide uppercase tracking-tight text-bone text-lg">
              CodeKinetix<sup className="text-volt text-[9px] align-super">®</sup>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="font-mono text-xs text-bone/60 hover:text-volt tracking-widest uppercase p-2"
          >
            CLOSE [×]
          </button>
        </div>

        <nav className="my-auto py-8 flex flex-col gap-4">

          <Link
            href="/"
            onClick={() => handleNav("studio")}
            className="mob-link font-extrabold type-xwide uppercase text-4xl sm:text-5xl text-bone hover:text-volt transition-colors"
          >
            STUDIO
          </Link>
          {NAV_LINKS.map((link, idx) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => handleNav(link.id)}
              className="mob-link font-extrabold type-xwide uppercase text-4xl sm:text-5xl text-bone hover:text-volt transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-ash tracking-normal">0{idx + 1}</span>
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => handleNav("contact")}
            className="mob-link font-extrabold type-xwide uppercase text-4xl sm:text-5xl text-volt hover:text-bone transition-colors"
          >
            START A PROJECT ↗
          </Link>
        </nav>

        <div className="pt-6 border-t border-bone/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] text-ash">
          <span>INDEPENDENT DIGITAL EXPERIENCE STUDIO</span>
          <span>AVAILABLE FOR NEW PROJECTS</span>
        </div>
      </div>
    </>
  );
}
