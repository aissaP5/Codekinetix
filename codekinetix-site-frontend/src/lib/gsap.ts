"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  // Disable lag smoothing so GSAP doesn't cap/throttle on 120Hz+ displays
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
