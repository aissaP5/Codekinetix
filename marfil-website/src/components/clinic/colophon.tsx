import { ToothChart } from "./bits";

const INDEX = [
  ["01", "THE HOUSE", "#top"],
  ["02", "THE TARIFF", "#tariff"],
  ["03", "THE GROUP", "#group"],
  ["04", "THE APPOINTMENT", "#book"],
];

export default function Colophon() {
  return (
    <footer className="bg-ink text-paper">
      <div className="px-5 md:px-10 xl:pl-14">
        {/* row 1 — mark + index + phone */}
        <div className="py-7 md:py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="flex items-center gap-4">
            <ToothChart filled={5} total={5} className="text-paper/70" />
            <span className="disp text-[15px] tracking-[0.04em]">
              MARFIL&thinsp;&middot;&thinsp;47
            </span>
            <span className="label text-paper/35 hidden sm:inline">
              CALLE DE SERRANO 47 · MADRID
            </span>
          </div>

          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
            aria-label="Footer index"
          >
            {INDEX.map(([n, t, href]) => (
              <a
                key={n}
                href={href}
                className="group mono text-[11px] text-paper/65 hover:text-paper transition-colors inline-flex items-baseline gap-1.5"
              >
                <span className="text-[9px] text-paper/35 group-hover:text-verm transition-colors">
                  {n}
                </span>
                <span className="border-b border-transparent group-hover:border-paper/50 transition-colors">
                  {t}
                </span>
              </a>
            ))}
            <a
              href="tel:+34910244747"
              className="label text-verm hover:text-paper transition-colors"
            >
              +34&nbsp;910&nbsp;24&nbsp;47&nbsp;47
            </a>
          </nav>
        </div>

        {/* row 2 — legal line */}
        <div className="border-t border-line-dark py-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span className="label text-paper/40">
            © 2026 MARFIL DENTAL GROUP S.L. — ALL PLATES RESERVED
          </span>
          <span className="label text-paper/40 inline-flex items-center gap-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#4d8a71]" />
            ACCEPTING PATIENTS ·{" "}
            <a
              href="mailto:hola@marfil.es"
              className="hover:text-paper/70 transition-colors"
            >
              HOLA@MARFIL.ES
            </a>
          </span>
          <span className="label text-paper/40 tabnum">
            N 40.4265° · W 3.6873°
          </span>
        </div>
      </div>
    </footer>
  );
}
