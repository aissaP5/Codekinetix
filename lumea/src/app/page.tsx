"use client";

import { useCallback, useState } from "react";
import SmoothScroll from "@/components/lumea/smooth-scroll";
import { BagProvider } from "@/components/lumea/bag";
import { ToastProvider } from "@/components/lumea/toast";
import Preloader from "@/components/lumea/preloader";
import Cursor from "@/components/lumea/cursor";
import Navbar from "@/components/lumea/navbar";
import Hero from "@/components/lumea/hero";
import Marquee from "@/components/lumea/marquee";
import Philosophy from "@/components/lumea/philosophy";
import Products from "@/components/lumea/products";
import Ritual from "@/components/lumea/ritual";
import Ingredients from "@/components/lumea/ingredients";
import Editorial from "@/components/lumea/editorial";
import Press from "@/components/lumea/press";
import Journal from "@/components/lumea/journal";
import FAQ from "@/components/lumea/faq";
import Newsletter from "@/components/lumea/newsletter";
import Footer from "@/components/lumea/footer";
import BagDrawer from "@/components/lumea/bag-drawer";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

export default function Home() {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  return (
    <SmoothScroll>
      <ToastProvider>
        <BagProvider>
          <Preloader onReveal={handleReveal} />
          <Cursor />
          <Navbar />

          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              <Hero started={revealed} />
              <Marquee />
              <Philosophy />
              <Products />
              <Ritual />
              <Ingredients />
              <Editorial />
              <Press />
              <Journal />
              <FAQ />
              <Newsletter />
            </main>
            <Footer />
          </div>

          <BagDrawer />

          {/* Film grain — a whisper of analog warmth */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[85] opacity-[0.05] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />
        </BagProvider>
      </ToastProvider>
    </SmoothScroll>
  );
}
