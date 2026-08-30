"use client";

import { Headline, Reveal, RevealImage, FigChip, ToothChart } from "./bits";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-12 lg:pt-0 overflow-hidden scroll-mt-12"
    >
      {/* ghost plate numeral */}
      <span
        aria-hidden="true"
        className="disp ghost absolute -bottom-10 left-2 text-[11rem] md:text-[17rem] leading-none select-none pointer-events-none"
      >
        47
      </span>

      <div className="px-5 md:px-10 xl:pl-14 grid lg:grid-cols-12 gap-x-10 gap-y-12 lg:min-h-screen items-stretch relative">
        {/* ——— left: the atlas title page ——— */}
        <div className="lg:col-span-7 flex flex-col justify-between pt-10 lg:pt-24 pb-10 lg:pb-14">
          <div>
            {/* running head */}
            <Reveal>
              <div className="flex items-center justify-between border-b border-line-strong pb-4">
                <span className="label text-ink/60">
                  MARFIL — CLINICAL ATLAS OF A DENTAL HOUSE
                </span>
                <span className="label text-ink/60 hidden sm:block">
                  MADRID · EST. 2009
                </span>
              </div>
            </Reveal>

            <h1 className="disp mt-10 md:mt-14 text-[clamp(2.6rem,6.35vw,6.1rem)]">
              <Headline
                lines={[
                  <>THE QUIET</>,
                  <>
                    SCIENCE
                    <span
                      className="arch-sm inline-block align-[-0.06em] w-[1.4em] h-[0.66em] overflow-hidden mx-[0.1em] border border-line-strong"
                      aria-hidden="true"
                    >
                      <img
                        src="/images/clinic/chip-instruments.png"
                        alt=""
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </span>
                  </>,
                  <>
                    OF THE{" "}
                    <em className="serif-i text-verm font-normal lowercase tracking-normal">
                      perfect
                    </em>
                  </>,
                  <>
                    SMILE
                    <span className="text-verm">.</span>
                    <span
                      className="arch-sm inline-block align-[-0.06em] w-[1.4em] h-[0.66em] overflow-hidden ml-[0.16em] border border-line-strong"
                      aria-hidden="true"
                    >
                      <img
                        src="/images/clinic/chip-detail.png"
                        alt=""
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </span>
                  </>,
                ]}
              />
            </h1>

            <Reveal delay={260}>
              <div className="mt-8 md:mt-10 flex items-start justify-between gap-8">
                <p className="max-w-md text-[15px] leading-relaxed text-ink/70">
                  MARFIL is a private dental house on Calle de Serrano 47,
                  catalogued here plate by plate — the tariff, the record
                  and the register of specialists. Four doctors, one
                  laboratory, no outsourced work.
                </p>
                <ToothChart filled={5} className="mt-2 text-pine shrink-0 hidden md:inline-flex" />
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#book"
                  className="label bg-ink text-paper px-7 py-4 hover:bg-verm transition-colors duration-300 inline-flex items-center gap-3"
                >
                  BOOK A VISIT <span aria-hidden="true">→</span>
                </a>
                <a
                  href="#tariff"
                  className="label border border-ink/45 px-7 py-4 hover:border-verm hover:text-verm transition-colors duration-300"
                >
                  READ THE TARIFF
                </a>
                <span className="label text-verm ml-1 hidden md:inline">
                  FIRST&nbsp;VISIT&nbsp;FREE
                </span>
              </div>
            </Reveal>
          </div>

          {/* meta strip */}
          <Reveal delay={420}>
            <dl className="mt-14 border-t border-line-strong grid grid-cols-2 md:grid-cols-4 gap-y-6">
              {[
                ["ADDRESS", "Calle de Serrano 47\n28001 Madrid"],
                ["HOURS", "Mon – Fri\n9:00 – 19:00"],
                ["TELEPHONE", "+34 910 24 47 47"],
                ["COORDINATES", "N 40.4265°\nW 3.6873°"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`pt-4 pr-4 ${i > 0 ? "md:border-l md:border-line md:pl-5" : ""}`}
                >
                  <dt className="label text-ink/45">{k}</dt>
                  <dd className="mono text-[11px] leading-relaxed mt-2 whitespace-pre-line text-ink/80">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ——— right: the arch plate ——— */}
        <div className="lg:col-span-5 relative pb-12 lg:pb-0">
          <div className="lg:h-screen lg:sticky lg:top-0 flex items-center py-2">
            <div className="relative w-full">
              {/* offset arch echo */}
              <div
                aria-hidden="true"
                className="arch absolute inset-0 translate-x-3 translate-y-3 border border-line-strong"
              />
              <RevealImage className="arch relative overflow-hidden bg-paper-2 aspect-[3/4] lg:aspect-auto lg:h-[82vh] lg:mt-[9vh]">
                <img
                  src="/images/clinic/hero-room.png"
                  alt="The treatment room of MARFIL dental clinic — dental chair and operating light beside an arched window"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </RevealImage>
              <FigChip className="absolute bottom-4 left-4">
                FIG.&nbsp;01 — TREATMENT&nbsp;ROOM&nbsp;Nº2
              </FigChip>
              <span
                className="label text-ink/50 absolute top-[12vh] -left-7 hidden lg:block [writing-mode:vertical-rl]"
                aria-hidden="true"
              >
                PLATE&nbsp;01 — THE&nbsp;HOUSE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
