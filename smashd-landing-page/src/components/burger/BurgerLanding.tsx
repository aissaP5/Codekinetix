"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Preloader } from "./Preloader";
import { CustomCursor } from "./CustomCursor";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { AnatomySection } from "./AnatomySection";
import { Manifesto } from "./Manifesto";
import { StackSection } from "./StackSection";
import { StatsSection } from "./StatsSection";
import { MenuSection } from "./MenuSection";
import { Footer } from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export function BurgerLanding() {
  const [loaded, setLoaded] = useState(false);

  /* Lenis smooth scroll, driven by the GSAP ticker */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  /* lock scroll while the preloader is up */
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!loaded) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loaded]);

  return (
    <div className="grain relative bg-background text-foreground min-h-screen">
      <Preloader onComplete={() => setLoaded(true)} />
      <CustomCursor />
      <Navbar visible={loaded} />
      <main>
        <Hero active={loaded} />
        <AnatomySection />
        <Manifesto />
        <StackSection />
        <StatsSection />
        <MenuSection />
      </main>
      <Footer />
    </div>
  );
}
