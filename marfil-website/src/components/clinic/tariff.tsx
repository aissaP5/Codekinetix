"use client";

import { useEffect, useState } from "react";
import { PlateHead, Reveal, ToothChart } from "./bits";

type Offer = {
  n: string;
  name: string;
  desc: string;
  session: string;
  was: string;
  now: string;
  badge: string;
  free?: boolean;
};

const OFFERS: Offer[] = [
  {
    n: "00",
    name: "First visit + 3D X-ray",
    desc: "Full diagnosis and a written treatment plan.",
    session: "45 min",
    was: "€90",
    now: "Free",
    badge: "GIFT",
    free: true,
  },
  {
    n: "01",
    name: "Ultrasonic cleaning + polish",
    desc: "Fluoride air-polish and remineralising varnish.",
    session: "50 min",
    was: "€75",
    now: "€39",
    badge: "−45%",
  },
  {
    n: "02",
    name: "LED whitening",
    desc: "Up to six shades brighter in a single session.",
    session: "90 min",
    was: "€290",
    now: "€189",
    badge: "−35%",
  },
  {
    n: "03",
    name: "Implant + ceramic crown",
    desc: "3D-guided surgery, Straumann® titanium.",
    session: "2 visits",
    was: "€1,450",
    now: "€990",
    badge: "−30%",
  },
  {
    n: "04",
    name: "Porcelain veneers",
    desc: "Hand-stratified ceramics from our own atelier.",
    session: "3 visits",
    was: "€450/ea",
    now: "€290/ea",
    badge: "2×1",
  },
  {
    n: "05",
    name: "Invisible orthodontics",
    desc: "Study, aligners and retention included.",
    session: "12–18 mo",
    was: "",
    now: "from €49/mo",
    badge: "0% INT.",
  },
];

function Row({ t, i }: { t: Offer; i: number }) {
  return (
    <Reveal delay={i * 60}>
      <a
        href="#book"
        className="group grid grid-cols-[2.6rem_1fr_auto] md:grid-cols-[4rem_minmax(0,1.25fr)_minmax(0,1.6fr)_6.5rem_9rem] items-center gap-x-4 lg:gap-x-6 border-b border-line px-2 md:px-4 py-5 md:py-6 transition-colors duration-300 hover:bg-ink hover:text-paper"
      >
        {/* Nº */}
        <span
          className={`mono text-[11px] tabnum ${t.free ? "text-verm" : "text-ink/45"} group-hover:text-paper/50 transition-colors`}
        >
          {t.n}
        </span>

        {/* procedure */}
        <span className="min-w-0">
          <span className="disp block text-[15px] md:text-[19px] leading-[1.05]">
            {t.name}
          </span>
          {/* includes — inline on mobile, own column on desktop */}
          <span className="block md:hidden text-[12px] leading-snug text-ink/55 group-hover:text-paper/60 transition-colors mt-1.5">
            {t.desc}
          </span>
        </span>

        {/* includes — desktop column */}
        <span className="hidden md:block text-[13px] leading-snug text-ink/55 group-hover:text-paper/60 transition-colors pr-6">
          {t.desc}
        </span>

        {/* session */}
        <span className="hidden md:block mono text-[11px] text-ink/55 group-hover:text-paper/60 transition-colors">
          {t.session}
        </span>

        {/* fee */}
        <span className="text-right leading-none">
          {t.was && (
            <span className="hidden md:inline mono text-[11px] text-ink/40 line-through decoration-verm/70 mr-2.5 group-hover:text-paper/40 transition-colors">
              {t.was}
            </span>
          )}
          <span
            className={`mono text-[15px] md:text-[19px] font-bold whitespace-nowrap ${
              t.free ? "text-verm" : ""
            }`}
          >
            {t.now}
          </span>
          <span className="hidden md:inline-flex label ml-3 align-middle border border-ink/35 group-hover:border-verm group-hover:text-verm px-1.5 py-1 transition-colors">
            {t.badge}
          </span>
        </span>
      </a>
    </Reveal>
  );
}

/* the record — kept from the archive: audited house figures */
const RECORD = [
  { v: 17, suffix: "", label: "YEARS IN PRACTICE", dec: 0, fmt: false },
  { v: 12400, suffix: "", label: "SMILES CREATED", dec: 0, fmt: true },
  { v: 98, suffix: "%", label: "PATIENTS WHO RETURN", dec: 0, fmt: false },
  { v: 4.9, suffix: "", label: "AV. RATING · 614 REVIEWS", dec: 1, fmt: false },
];

const LISTED = [
  "ISO 9001:2015",
  "COLLEGE OF DENTISTS · MADRID",
  "INVISALIGN DIAMOND",
  "STRAUMANN PARTNER",
];

export default function Tariff() {
  /* counters run once, when the record strip scrolls into view */
  const [vals, setVals] = useState(RECORD.map(() => 0));
  useEffect(() => {
    const el = document.getElementById("the-record");
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const start = performance.now();
        const DURATION = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          setVals(RECORD.map((s) => s.v * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="tariff" className="relative scroll-mt-12">
      <PlateHead index="02" title="THE TARIFF — OUR OFFERS, SEASON 2026" fig="FIG. 02 — SIX SIGNATURES, PRICED OPENLY" />

      <div className="px-5 md:px-10 xl:pl-14 pt-12 md:pt-16 pb-20 md:pb-28">
        {/* statement row */}
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-6 mb-12 md:mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="disp text-[clamp(2.1rem,4.6vw,4.3rem)]">
              EVERY FEE{" "}
              <em className="serif-i text-verm font-normal lowercase tracking-normal">
                written
              </em>{" "}
              DOWN.
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[14px] leading-relaxed text-ink/65">
              The house tariff works like a price list in an old catalogue:
              six entries, each with the full protocol included —
              consultation, treatment, aftercare — and 0% financing on
              everything listed. The written quote you receive is the number
              you pay.
            </p>
          </Reveal>
        </div>

        {/* ledger header */}
        <div className="hidden md:grid grid-cols-[4rem_minmax(0,1.25fr)_minmax(0,1.6fr)_6.5rem_9rem] gap-x-6 border-b-2 border-ink px-4 pb-3 label text-ink/55">
          <span>Nº</span>
          <span>PROCEDURE</span>
          <span>INCLUDES</span>
          <span>SESSION</span>
          <span className="text-right">FEE / SEASON</span>
        </div>

        {/* ledger rows */}
        {OFFERS.map((t, i) => (
          <Row key={t.n} t={t} i={i} />
        ))}

        {/* footnote */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <ToothChart filled={2} className="text-verm" />
              <p className="label text-ink/45 leading-relaxed">
                VALID UNTIL 31 OCTOBER 2026 · WRITTEN QUOTE BEFORE ANY
                TREATMENT · NO HIDDEN UNITS
              </p>
            </div>
            <a
              href="#book"
              className="label inline-flex items-center gap-3 text-ink border-b-2 border-verm pb-1.5 w-fit hover:text-verm transition-colors"
            >
              RESERVE AN ENTRY IN THE TARIFF <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Reveal>

        {/* ——— the record — audited figures, counted live ——— */}
        <div
          id="the-record"
          className="mt-16 md:mt-20 border-t-2 border-ink pt-8 md:pt-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8"
        >
          {RECORD.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 md:px-4 ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
            >
              <div className="mono font-bold text-[clamp(2rem,4vw,3.2rem)] leading-none tabnum text-ink">
                {s.fmt
                  ? new Intl.NumberFormat("en-US").format(Math.round(vals[i]))
                  : vals[i].toFixed(s.dec)}
                <span className="text-verm text-[0.55em] align-top ml-1">
                  {s.suffix}
                </span>
              </div>
              <div className="label text-ink/50 mt-3">{s.label}</div>
            </div>
          ))}
        </div>
        <Reveal>
          <p className="label text-ink/40 mt-6">
            THE RECORD — AUDITED YEARLY · FIGURES AS OF JUNE 2026
          </p>
        </Reveal>

        {/* ——— listed & verified — one-line credentials ——— */}
        <Reveal delay={100}>
          <div className="mt-8 border-t border-line pt-5 pb-2 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <span className="label text-verm">LISTED&nbsp;&amp;&nbsp;VERIFIED</span>
            {LISTED.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-5">
                <span className="label text-ink/55">{c}</span>
                {i < LISTED.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 rotate-45 border border-ink/35"
                  />
                )}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
