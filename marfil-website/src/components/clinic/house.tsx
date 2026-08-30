"use client";

import { PlateHead, Reveal, RevealImage, FigChip } from "./bits";

const FACTS: [string, string][] = [
  ["FOUNDED", "2009 — Calle de Serrano"],
  ["SPECIALISTS", "4 · no rotating staff"],
  ["SMILES CREATED", "12,400+"],
  ["STANDARD", "One clinic, one atelier"],
];

const KEY = [
  { code: "B·1", room: "THE WAITING ROOM", floor: "GROUND · SERRANO", area: "38 M²" },
  { code: "B·2", room: "CABINET Nº1", floor: "FIRST FLOOR · EAST", area: "22 M²" },
  { code: "B·3", room: "THE RECEPTION", floor: "GROUND FLOOR", area: "18 M²" },
  { code: "B·4", room: "THE STERILE SUITE", floor: "FIRST FLOOR · LAMINAR", area: "16 M²" },
];

const LINE = [
  { code: "D-01", name: "IMPLANTOLOGY", who: "Dr. Soler" },
  { code: "D-02", name: "CERAMICS ATELIER", who: "Dr. Marqués" },
  { code: "D-03", name: "ORTHODONTICS", who: "Dra. Ferrán" },
  { code: "D-04", name: "ENDODONTICS", who: "Dr. Aguirre" },
];

const REGISTER = [
  {
    img: "/images/atelier/doc-2.png",
    name: "Dr. Andrés Soler",
    role: "DIRECTOR · IMPLANTOLOGY",
    col: "COL. Nº 4802117",
    line: "More than 1,800 implants placed with 3D-guided surgery.",
  },
  {
    img: "/images/atelier/doc-1.png",
    name: "Dr. Elena Marqués",
    role: "FOUNDER · PROSTHETICS & CERAMICS",
    col: "COL. Nº 4722094",
    line: "Stratifies every veneer by hand in our own atelier.",
  },
  {
    img: "/images/atelier/doc-3.png",
    name: "Dra. Lucía Ferrán",
    role: "INVISIBLE ORTHODONTICS",
    col: "COL. Nº 28913456",
    line: "Invisalign Diamond Provider. 900+ cases finished.",
  },
  {
    img: "/images/atelier/doc-4.png",
    name: "Dr. Daniel Aguirre",
    role: "ENDODONTICS & AESTHETICS",
    col: "COL. Nº 28933470",
    line: "Dental microscope · single-session treatments.",
  },
];

export default function House() {
  return (
    <section id="group" className="scroll-mt-12">
      <PlateHead index="03" title="THE GROUP — FOUR SPECIALISTS, ONE STANDARD" fig="FIG. 03 — ORGANISATION, DRAWN AS A LINE" />

      <div className="px-5 md:px-10 xl:pl-14 py-16 md:py-24">
        {/* statement */}
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-6 mb-14 md:mb-20">
          <Reveal className="lg:col-span-7">
            <h2 className="disp text-[clamp(2.1rem,4.6vw,4.3rem)]">
              ONE ADDRESS.{" "}
              <em className="serif-i text-verm font-normal lowercase tracking-normal">
                no
              </em>{" "}
              BRANCHES.
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[14px] leading-relaxed text-ink/65">
              Whoever plans your treatment is the one who performs it. Always.
              The house has stayed deliberately small since 2009.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
          {/* ——— left column: narrative ——— */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-5 text-[14.5px] leading-relaxed text-ink/70">
                <p>
                  MARFIL is an independent dental group founded in 2009 by
                  Dr. Elena Marqués. We deliberately stayed one address: a
                  single clinic in Madrid&rsquo;s Salamanca district, with our own
                  ceramics atelier, sterile-processing suite and digital
                  imaging floor under the same roof — because consistency,
                  not expansion, is what makes results repeatable.
                </p>
                <p>
                  The four specialists in the register below lead every
                  treatment personally, from the first scan to the final
                  polish. They share one laboratory, one protocol and one
                  Thursday case meeting — so the plan made in January is the
                  plan delivered in June, with no handovers, no outsourced
                  work and no surprises.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ——— right column: the line + the facts ——— */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {/* the Serrano line — organisation drawn as a transit diagram */}
            <Reveal delay={100}>
              <div>
                <div className="flex items-baseline justify-between mb-7">
                  <span className="label text-ink/50">
                    THE SERRANO LINE — DEPARTMENTS UNDER ONE ROOF
                  </span>
                  <span className="label text-verm">NO&nbsp;BRANCHES</span>
                </div>

                <div className="relative">
                  {/* the line — spans exactly from the first ring to the last, no end caps */}
                  <div className="relative h-[3px] bg-pine ml-[11px] mr-[calc(25%_-_11px)]" />

                  <div className="grid grid-cols-4">
                    {LINE.map((d) => (
                      <div key={d.code} className="relative pt-6 md:pt-7 pr-2">
                        <span className="absolute top-[-5.5px] left-1 h-3.5 w-3.5 rounded-full border-[3px] border-pine bg-paper" />
                        <div className="label text-pine">{d.code}</div>
                        <div className="disp text-[10px] md:text-[13px] leading-[1.15] mt-1.5">
                          {d.name}
                        </div>
                        <div className="mono text-[10px] text-ink/50 mt-1.5">
                          {d.who}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-9 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <span className="label text-ink/40">
                    FIG.&nbsp;03/C — INTERCHANGE&nbsp;AT&nbsp;THE&nbsp;STERILE&nbsp;SUITE
                  </span>
                  <span className="stamp text-verm text-[10px]">
                    EST.&nbsp;2009&nbsp;·&nbsp;ONE&nbsp;LINE
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <dl className="border-t-2 border-ink">
                {FACTS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 py-4 border-b border-line"
                  >
                    <dt className="label text-ink/45">{k}</dt>
                    <dd className="mono text-[12px] text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* ——— the survey — four rooms of this house on one plate ——— */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
              <span className="label text-ink/60">
                THE SURVEY — THE PREMISES, ROOM BY ROOM
              </span>
              <span className="label text-ink/40">
                FIG.&nbsp;03/B — FOUR&nbsp;ROOMS,&nbsp;ONE&nbsp;ROOF
              </span>
            </div>
          </Reveal>

          <div className="mt-7 grid grid-cols-12 gap-3 md:gap-4">
            {/* 1 BIG — the waiting room (spans two rows) */}
            <div className="group relative col-span-12 aspect-[3/4] md:col-span-7 md:row-span-2 md:aspect-auto md:h-full">
              <RevealImage className="relative h-full w-full overflow-hidden border border-line-strong">
                <img
                  src="/images/clinic/survey-waiting.png"
                  alt="The waiting room at MARFIL — oak bench with ivory cushions under arched windows, olive tree, terracotta floor"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </RevealImage>
              <FigChip className="absolute bottom-3 left-3">
                FIG.&nbsp;03/B·1 — THE&nbsp;WAITING&nbsp;ROOM
              </FigChip>
            </div>

            {/* 2 MEDIUM — cabinet nº1 */}
            <div className="group relative col-span-12 aspect-[4/3] md:col-span-5">
              <RevealImage className="relative h-full w-full overflow-hidden border border-line-strong">
                <img
                  src="/images/clinic/survey-cabinet.png"
                  alt="Cabinet nº1 at MARFIL — dental chair by a window overlooking the Madrid rooftops, walnut cabinetry"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </RevealImage>
              <FigChip className="absolute bottom-3 left-3">
                FIG.&nbsp;03/B·2 — CABINET&nbsp;Nº1
              </FigChip>
            </div>

            {/* 3 MEDIUM — the reception */}
            <div className="group relative col-span-12 aspect-[4/3] md:col-span-5">
              <RevealImage className="relative h-full w-full overflow-hidden border border-line-strong">
                <img
                  src="/images/clinic/survey-reception.png"
                  alt="The reception of MARFIL — curved oak desk beneath a softly lit arched niche"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </RevealImage>
              <FigChip className="absolute bottom-3 left-3">
                FIG.&nbsp;03/B·3 — THE&nbsp;RECEPTION
              </FigChip>
            </div>

            {/* 4 SMALL — the sterile suite */}
            <div className="group relative col-span-12 aspect-[4/3] md:col-span-5 md:aspect-[16/10]">
              <RevealImage className="relative h-full w-full overflow-hidden border border-line-strong">
                <img
                  src="/images/clinic/survey-sterile.png"
                  alt="The sterile suite at MARFIL — sealed instrument pouches on a steel tray beside the autoclave"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </RevealImage>
              <FigChip className="absolute bottom-3 left-3">
                FIG.&nbsp;03/B·4 — THE&nbsp;STERILE&nbsp;SUITE
              </FigChip>
            </div>

            {/* key to the survey — room index, drawn like a ledger */}
            <div className="col-span-12 flex flex-col justify-center md:col-span-7">
              <Reveal delay={120}>
                <div className="flex items-baseline justify-between border-b-2 border-ink pb-2.5">
                  <span className="label text-ink/60">
                    KEY&nbsp;TO&nbsp;THE&nbsp;SURVEY
                  </span>
                  <span className="label text-ink/40">
                    4&nbsp;OF&nbsp;11&nbsp;ROOMS
                  </span>
                </div>
                {KEY.map((k) => (
                  <div
                    key={k.code}
                    className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3.5rem_1fr_11rem_4.5rem] items-baseline gap-x-4 border-b border-line py-3.5"
                  >
                    <span className="mono text-[11px] text-verm tabnum">
                      {k.code}
                    </span>
                    <span className="disp text-[13px] md:text-[14px] leading-none">
                      {k.room}
                    </span>
                    <span className="hidden md:block label text-ink/45">
                      {k.floor}
                    </span>
                    <span className="mono text-[11px] text-right tabnum text-ink/70">
                      {k.area}
                    </span>
                  </div>
                ))}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <span className="label text-ink/40 leading-relaxed">
                    EVERY PHOTOGRAPH TAKEN IN THIS HOUSE — AUGUST 2026
                  </span>
                  <span className="stamp text-verm text-[10px] whitespace-nowrap">
                    ONE&nbsp;ADDRESS&nbsp;·&nbsp;NO&nbsp;BRANCHES
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ——— the register ——— */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
              <span className="label text-ink/60">
                THE REGISTER — PERSONS ENTITLED TO PRACTISE IN THIS HOUSE
              </span>
              <span className="label text-ink/40">4&nbsp;ENTRIES</span>
            </div>
          </Reveal>

          {REGISTER.map((m, i) => (
            <Reveal key={m.name} delay={i * 70}>
              <article className="group grid grid-cols-[2.6rem_3.4rem_minmax(0,1fr)] md:grid-cols-[4rem_4.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] items-center gap-x-4 md:gap-x-7 border-b border-line py-5 md:py-6 px-1 md:px-3 transition-colors duration-300 hover:bg-paper-2">
                <span className="mono text-[11px] text-ink/40 tabnum">
                  R-0{i + 1}
                </span>
                <span className="arch-sm overflow-hidden border border-line w-full max-w-[3.4rem] md:max-w-[4.5rem] aspect-[3/4] block bg-paper-2">
                  <img
                    src={m.img}
                    alt={`Portrait of ${m.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0">
                  <span className="disp block text-[15px] md:text-[19px] leading-tight">
                    {m.name}
                  </span>
                  <span className="label text-verm block mt-1.5">
                    {m.role}
                  </span>
                </span>
                <span className="hidden md:block text-[13px] leading-snug text-ink/60">
                  {m.line}
                </span>
                <span className="hidden md:block mono text-[10px] text-ink/45 text-right tabnum">
                  {m.col}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
