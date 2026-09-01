"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/* ──────────────────────────────── 1. PRODUCT COLORWAY & LIGHTING */
function ProductColorwayDemo() {
  const [selectedColor, setSelectedColor] = useState(0);

  const VARIANTS = [
    { name: "Obsidian Void", hex: "#0a0a0b", accent: "#3a6fff", glow: "rgba(58,111,255,0.35)" },
    { name: "Acid Volt", hex: "#c6ff00", accent: "#c6ff00", glow: "rgba(198,255,0,0.35)" },
    { name: "Raw Titanium", hex: "#9d9d94", accent: "#f2f1ea", glow: "rgba(242,241,234,0.35)" },
    { name: "Flame Ember", hex: "#ff4d00", accent: "#ff4d00", glow: "rgba(255,77,0,0.35)" },
  ];

  const current = VARIANTS[selectedColor];

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden bg-void/90">
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${current.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between relative z-10 font-mono text-[9px] text-bone/40 tracking-widest uppercase">
        <span>3D LUXURY CONFIGURATOR</span>
        <span style={{ color: current.accent }} className="font-bold">{current.name}</span>
      </div>

      <div className="relative z-10 flex items-center justify-center my-4">
        <div
          className="w-36 h-36 rounded-2xl border transition-all duration-700 flex flex-col items-center justify-center p-4 relative shadow-2xl"
          style={{
            borderColor: current.accent,
            boxShadow: `0 20px 50px ${current.glow}`,
            background: `linear-gradient(145deg, #151517 0%, ${current.hex} 100%)`,
          }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center font-mono text-xs font-bold"
            style={{ borderColor: current.accent, color: current.accent }}
          >
            CK
          </div>
          <span className="font-mono text-[9px] text-bone/60 mt-3 tracking-widest uppercase">
            FLAGSHIP 01
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3">
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            onClick={() => setSelectedColor(i)}
            aria-label={v.name}
            className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${
              selectedColor === i ? "scale-125 border-bone shadow-lg" : "border-bone/20 hover:scale-110"
            }`}
            style={{ backgroundColor: v.hex }}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────── 2. INTERACTIVE BEFORE / AFTER LENS (FIXED CLIP-PATH) */
function BeforeAfterDemo() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointer(e);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => {
        if (e.buttons === 1) handlePointer(e);
      }}
      className="h-full relative overflow-hidden select-none cursor-ew-resize bg-void/90 touch-none"
    >
      {/* "Before" Layer (Generic standard template) */}
      <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between bg-panel/40 text-bone/40 pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest uppercase text-bone/40">
            STANDARD THEME
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-bone/10 text-bone/50">
            3.4s LOAD • 42 FPS
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-bone/15 w-48 rounded" />
          <div className="h-3 bg-bone/10 w-64 rounded" />
          <div className="flex gap-2 pt-1">
            <div className="h-7 bg-bone/15 w-24 rounded" />
            <div className="h-7 bg-bone/10 w-20 rounded" />
          </div>
        </div>
        <span className="font-mono text-[9px] text-bone/35">
          GENERIC CMS TEMPLATE • RIGID LAYOUT
        </span>
      </div>

      {/* "After" Layer (CodeKinetix Haute-Couture with clip-path so text never squishes) */}
      <div
        className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between bg-void/95 text-bone pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-volt uppercase font-bold">
            CODEKINETIX BESPOKE
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-volt/15 text-volt font-bold">
            0.4s LOAD • 60 FPS
          </span>
        </div>
        <div className="space-y-1.5">
          <h4 className="font-extrabold type-xwide text-2xl sm:text-3xl text-bone uppercase tracking-tight">
            CUSTOM CRAFT
          </h4>
          <p className="font-serif italic text-volt text-sm">
            GPU-accelerated kinetic choreography
          </p>
        </div>
        <span className="font-mono text-[9px] text-bone/60 tracking-wider">
          EDGE ARCHITECTURE • 100% LIGHTHOUSE
        </span>
      </div>

      {/* Interactive Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-volt pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-volt text-void flex items-center justify-center font-mono font-bold text-[11px] shadow-[0_0_20px_rgba(198,255,0,0.6)] border-2 border-void">
          ↔
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────── 3. INTERACTIVE ROI & REVENUE CALCULATOR */
function RoiCalculatorDemo() {
  const [traffic, setTraffic] = useState(35); // in thousands (35k)
  const [avgOrder, setAvgOrder] = useState(120); // in dollars

  // Formula: 1.8% baseline conversion + 1.2% speed lift = ~+$X/mo
  const monthlyVisitors = traffic * 1000;
  const speedLiftOrders = Math.round(monthlyVisitors * 0.012);
  const estAddedRevenue = Math.round(speedLiftOrders * avgOrder);

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-void/90 relative overflow-hidden">
      <div className="flex items-center justify-between font-mono text-[9px] text-bone/40 tracking-widest uppercase">
        <span>ROI & REVENUE IMPACT</span>
        <span className="text-volt font-bold">+1.2% CONVERSION LIFT</span>
      </div>

      <div className="bg-panel/40 border border-bone/10 p-3.5 rounded-lg my-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-bone/60 uppercase">MONTHLY TRAFFIC</span>
          <span className="font-mono text-xs text-bone font-bold">{traffic}K visitors</span>
        </div>
        <input
          type="range"
          min="5"
          max="200"
          step="5"
          value={traffic}
          onChange={(e) => setTraffic(parseInt(e.target.value, 10))}
          className="w-full accent-volt cursor-pointer h-1.5 bg-bone/15 rounded"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[10px] text-bone/60 uppercase">AVG ORDER / DEAL</span>
          <span className="font-mono text-xs text-bone font-bold">${avgOrder}</span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          step="10"
          value={avgOrder}
          onChange={(e) => setAvgOrder(parseInt(e.target.value, 10))}
          className="w-full accent-volt cursor-pointer h-1.5 bg-bone/15 rounded"
        />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-bone/10">
        <div>
          <span className="font-mono text-[9px] text-bone/40 uppercase block">PROJECTED EXTRA REVENUE</span>
          <span className="font-extrabold type-wide text-volt text-lg sm:text-xl">
            +${estAddedRevenue.toLocaleString()}<span className="text-[10px] font-mono text-bone/60 font-normal">/mo</span>
          </span>
        </div>
        <span className="font-mono text-[9px] text-volt bg-volt/10 border border-volt/30 px-2 py-1 rounded">
          {speedLiftOrders} EXTRA SALES
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────── 4. MAGNETIC QUICK ACTION PILL */
function MagneticPillDemo() {
  const pillRef = useRef<HTMLDivElement>(null);
  const [statusText, setStatusText] = useState("DRAG OR HOVER ACTION PILL");

  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let base: DOMRect | null = null;
    const xTo = gsap.quickTo(pill, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(pill, "y", { duration: 0.3, ease: "power3" });

    const onEnter = () => { base = pill.getBoundingClientRect(); };
    const onMove = (e: MouseEvent) => {
      if (!base) return;
      xTo((e.clientX - (base.left + base.width / 2)) * 0.4);
      yTo((e.clientY - (base.top + base.height / 2)) * 0.5);
    };
    const onLeave = () => { base = null; xTo(0); yTo(0); };

    pill.addEventListener("mouseenter", onEnter);
    pill.addEventListener("mousemove", onMove);
    pill.addEventListener("mouseleave", onLeave);

    return () => {
      pill.removeEventListener("mouseenter", onEnter);
      pill.removeEventListener("mousemove", onMove);
      pill.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-void/90">
      <div
        ref={pillRef}
        className="relative z-10 bg-panel border-2 border-volt/80 px-6 py-4 rounded-full flex items-center gap-4 shadow-[0_10px_35px_rgba(58,111,255,0.25)] transition-shadow hover:shadow-[0_10px_45px_rgba(58,111,255,0.45)]"
      >
        <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
        <span className="font-mono text-xs font-bold text-bone tracking-widest uppercase">
          COMMISSION STUDIO
        </span>
        <button
          onClick={() => setStatusText("PROPOSAL MODAL TRIGGERED")}
          className="bg-volt text-void font-mono text-[10px] font-bold tracking-wider px-3 py-1 rounded-full hover:bg-bone transition-colors uppercase"
        >
          START ↗
        </button>
      </div>
      <p className="font-mono text-[9px] text-bone/35 tracking-wider mt-6">
        {statusText}
      </p>
    </div>
  );
}

/* ──────────────────────────────── 5. HOLOGRAM GYROSCOPE CARD */
function HologramCardDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const sheen = sheenRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -20;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 20;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 800,
    });

    if (sheen) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.3) 0%, rgba(58,111,255,0.2) 40%, transparent 70%)`;
    }
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    const sheen = sheenRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    if (sheen) sheen.style.background = "transparent";
  };

  return (
    <div className="h-full flex items-center justify-center p-6 [perspective:900px] bg-void/90">
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="w-full max-w-[280px] aspect-[1.6/1] bg-gradient-to-br from-[#1c1c20] to-[#0a0a0b] border border-bone/20 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-2xl cursor-pointer will-change-transform"
      >
        <div ref={sheenRef} className="absolute inset-0 pointer-events-none transition-opacity" />
        <div className="flex items-center justify-between relative z-10">
          <span className="font-mono text-[9px] text-volt tracking-widest uppercase">
            VIP ACCESS PASS
          </span>
          <span className="w-2 h-2 rounded-full bg-volt" />
        </div>
        <div className="relative z-10">
          <h4 className="font-extrabold type-wide uppercase text-bone text-lg tracking-tight">
            CODEKINETIX
          </h4>
          <p className="font-mono text-[9px] text-bone/40">
            PRIVATE DIGITAL CLIENT ARCHIVE
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────── 6. DYNAMIC FONT MORPH SHIFTER */
function FontShifterDemo() {
  const [styleMode, setStyleMode] = useState<"mono" | "serif" | "display" | "outline">("display");

  return (
    <div className="h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-void/90">
      <div className="w-full flex items-center justify-between font-mono text-[9px] text-bone/40 tracking-widest uppercase">
        <span>VARIABLE TYPOGRAPHY ENGINE</span>
        <span className="text-volt font-bold">{styleMode.toUpperCase()}</span>
      </div>

      <div className="my-auto text-center py-4">
        {styleMode === "display" && (
          <h3 className="font-extrabold type-xwide uppercase text-3xl sm:text-4xl text-bone tracking-tight leading-none animate-in fade-in">
            IMPACT.
          </h3>
        )}
        {styleMode === "serif" && (
          <h3 className="font-serif italic text-3xl sm:text-4xl text-bone tracking-normal leading-none animate-in fade-in">
            Elegance.
          </h3>
        )}
        {styleMode === "mono" && (
          <h3 className="font-mono font-bold text-2xl sm:text-3xl text-volt tracking-widest leading-none animate-in fade-in">
            [PRECISION]
          </h3>
        )}
        {styleMode === "outline" && (
          <h3
            className="font-extrabold type-xwide uppercase text-3xl sm:text-4xl text-transparent tracking-tight leading-none animate-in fade-in"
            style={{ WebkitTextStroke: "1px #f2f1ea" }}
          >
            MONUMENTAL.
          </h3>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-full">
        {(["display", "serif", "mono", "outline"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setStyleMode(m)}
            className={`py-1.5 font-mono text-[9px] tracking-wider uppercase border transition-all ${
              styleMode === m
                ? "bg-volt text-void border-volt font-bold"
                : "bg-void border-bone/15 text-bone/50 hover:text-bone"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────── EXPERIMENTS LIST */
const EXPERIMENTS = [
  {
    title: "Product Configurator & Ambient Light",
    tag: "COMMERCIAL UI",
    desc: "Dynamic colorway switching with real-time backdrop luminescence calculation.",
    component: <ProductColorwayDemo />,
  },
  {
    title: "Interactive Before / After Lens",
    tag: "CONVERSION TOOL",
    desc: "Draggable high-precision split frame comparing standard templates to custom craft.",
    component: <BeforeAfterDemo />,
  },
  {
    title: "Interactive ROI & Revenue Calculator",
    tag: "GROWTH ENGINE",
    desc: "Real-time revenue impact and conversion lift estimation based on sub-second load speeds.",
    component: <RoiCalculatorDemo />,
  },
  {
    title: "Magnetic Floating Action Pill",
    tag: "INTERACTION ENGINE",
    desc: "Damped spring cursor tracking with expandable interactive states.",
    component: <MagneticPillDemo />,
  },
  {
    title: "Holographic Gyroscope Pass",
    tag: "3D PERSPECTIVE",
    desc: "Hardware-accelerated CSS perspective matrices with iridescent sheen tracking.",
    component: <HologramCardDemo />,
  },
  {
    title: "Variable Typographic Shifter",
    tag: "EDITORIAL DESIGN",
    desc: "Instant kinetic typography morphing between luxury serif and brutalist sans.",
    component: <FontShifterDemo />,
  },
];

export default function LabGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {EXPERIMENTS.map((exp) => (
        <div
          key={exp.title}
          className="lab-card border border-bone/12 bg-panel/30 overflow-hidden flex flex-col justify-between group hover:border-volt/50 transition-all duration-400"
        >
          <div className="h-72 bg-void/80 relative">
            {exp.component}
          </div>

          <div className="p-5 border-t border-bone/10 bg-panel/50">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-extrabold type-wide uppercase text-sm text-bone">
                {exp.title}
              </h3>
              <span className="font-mono text-[8px] tracking-widest text-volt uppercase bg-volt/10 px-2 py-0.5">
                {exp.tag}
              </span>
            </div>
            <p className="text-bone/50 text-xs leading-relaxed">
              {exp.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
