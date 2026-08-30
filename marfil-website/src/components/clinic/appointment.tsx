"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlateHead, Reveal, useInView } from "./bits";

const TREATMENT_OPTIONS = [
  "Offer — Free first visit",
  "Offer — Cleaning €39",
  "Offer — LED whitening €189",
  "Offer — Implant + crown €990",
  "Offer — Porcelain veneers",
  "Offer — Invisible orthodontics",
  "Routine check-up & cleaning",
  "Dental emergency",
  "Other treatment",
];

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="label text-ink/50 block mb-0.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/* Success state — own component so the observer attaches after mount */
function SuccessPanel({ onReset }: { onReset: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div className="py-10 md:py-14 text-center" ref={ref}>
      <span
        className={`stamp stamp-in text-verm text-[15px] md:text-[18px] py-3 px-6 ${
          inView ? "is-in" : ""
        }`}
      >
        RECEIVED — CALL&nbsp;BACK&nbsp;&lt;&nbsp;1&nbsp;DAY
      </span>
      <p className="disp text-[22px] md:text-[26px] mt-9">
        YOUR ENTRY IS IN THE BOOK.
      </p>
      <p className="text-[13.5px] leading-relaxed text-ink/60 mt-4 max-w-sm mx-auto">
        We&rsquo;ve received your request. We&rsquo;ll call you within one
        working day to confirm the appointment.
      </p>
      <button
        onClick={onReset}
        className="label mt-9 border-b-2 border-verm pb-1 text-ink hover:text-verm transition-colors"
      >
        WRITE ANOTHER ENTRY
      </button>
    </div>
  );
}

export default function Appointment() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          treatment: fd.get("treatment"),
          date: fd.get("date"),
          message: fd.get("message") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Something went wrong. Call us at +34 910 24 47 47.");
        return;
      }
      setSent(true);
      toast.success("Request received — we'll call you back within one working day.");
      form.reset();
    } catch {
      toast.error("Network error. Please try again or call +34 910 24 47 47.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="book" className="bg-pine-deep text-paper scroll-mt-12">
      <div className="px-5 md:px-10 xl:pl-14">
        <PlateHead index="04" title="THE APPOINTMENT" fig="FIG. 04 — WRITTEN ON THE HOUSE PAD" dark />
      </div>

      <div className="px-5 md:px-10 xl:pl-14 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
          {/* ——— left: the invitation ——— */}
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="disp text-[clamp(2.2rem,4.8vw,4.5rem)]">
                THE FIRST VISIT IS{" "}
                <em className="serif-i font-normal lowercase tracking-normal text-[#e58a5f]">
                  on the house.
                </em>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[14.5px] leading-relaxed text-paper/70 mt-7 max-w-md">
                Free and with no commitment: a 3D X-ray, photographs and a
                fixed written quote. No decisions are made in the chair —
                you take the plan home and think about it. Fill in the pad
                and we will call you back within one working day.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <dl className="mt-12 border-t border-line-pine">
                {[
                  ["ADDRESS", "Calle de Serrano 47\n28001 Madrid, Spain"],
                  ["TELEPHONE", "+34 910 24 47 47"],
                  ["EMAIL", "hola@marfil.es"],
                  ["HOURS", "Monday – Friday · 9:00 – 19:00\nSaturday by appointment"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[110px_1fr] gap-4 py-5 border-b border-line-pine"
                  >
                    <dt className="label text-paper/50 pt-1">{k}</dt>
                    <dd className="mono text-[12px] text-paper/85 whitespace-pre-line leading-relaxed">
                      {k === "TELEPHONE" ? (
                        <a
                          href="tel:+34910244747"
                          className="hover:text-paper underline decoration-paper/30 underline-offset-4 transition-colors"
                        >
                          {v}
                        </a>
                      ) : k === "EMAIL" ? (
                        <a
                          href="mailto:hola@marfil.es"
                          className="hover:text-paper underline decoration-paper/30 underline-offset-4 transition-colors"
                        >
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ——— right: the house pad ——— */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={150}>
              <div className="relative bg-paper text-ink shadow-[0_30px_60px_rgba(0,0,0,0.35)] pl-8 pr-6 md:pl-12 md:pr-10 py-8 md:py-11">
                {/* punched filing holes */}
                <span className="punch absolute left-[10px] top-10" aria-hidden="true" />
                <span className="punch absolute left-[10px] top-1/2 -translate-y-1/2" aria-hidden="true" />
                <span className="punch absolute left-[10px] bottom-10" aria-hidden="true" />

                {sent ? (
                  <SuccessPanel onReset={() => setSent(false)} />
                ) : (
                  <>
                    {/* pad header */}
                    <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-5">
                      <div>
                        <div className="disp text-[15px] md:text-[17px]">
                          MARFIL — DENTAL HOUSE
                        </div>
                        <div className="label text-ink/50 mt-1.5">
                          CALLE DE SERRANO 47 · 28001 MADRID
                        </div>
                      </div>
                      <div
                        className="disp text-[34px] md:text-[42px] leading-none text-verm"
                        aria-hidden="true"
                      >
                        R<sub className="text-[0.55em]">x</sub>
                      </div>
                    </div>
                    <div className="label text-ink/45 pt-2.5 pb-6">
                      APPOINTMENT SLIP — Nº 47-{new Date().getFullYear()} · TO BE COMPLETED BY THE PATIENT
                    </div>

                    <form onSubmit={onSubmit} className="space-y-7">
                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                        <Field id="bk-name" label="NAME *">
                          <input
                            id="bk-name"
                            name="name"
                            required
                            minLength={2}
                            placeholder="Carmen Ortega"
                            className="field"
                            autoComplete="name"
                          />
                        </Field>
                        <Field id="bk-phone" label="TELEPHONE *">
                          <input
                            id="bk-phone"
                            name="phone"
                            type="tel"
                            required
                            minLength={6}
                            placeholder="+34 600 000 000"
                            className="field"
                            autoComplete="tel"
                          />
                        </Field>
                      </div>

                      <Field id="bk-email" label="EMAIL *">
                        <input
                          id="bk-email"
                          name="email"
                          type="email"
                          required
                          placeholder="carmen@correo.es"
                          className="field"
                          autoComplete="email"
                        />
                      </Field>

                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                        <Field id="bk-treatment" label="TREATMENT *">
                          <select
                            id="bk-treatment"
                            name="treatment"
                            required
                            defaultValue=""
                            className="field"
                          >
                            <option value="" disabled>
                              Choose…
                            </option>
                            {TREATMENT_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <span
                            className="pointer-events-none absolute right-0 bottom-3 text-ink/60"
                            aria-hidden="true"
                          >
                            ↓
                          </span>
                        </Field>
                        <Field id="bk-date" label="PREFERRED DATE *">
                          <input
                            id="bk-date"
                            name="date"
                            type="date"
                            required
                            min={today}
                            className="field"
                          />
                        </Field>
                      </div>

                      <Field id="bk-message" label="ANYTHING WE SHOULD KNOW?">
                        <textarea
                          id="bk-message"
                          name="message"
                          rows={3}
                          placeholder="Optional — tell us about your case"
                          className="field resize-none"
                        />
                      </Field>

                      <button
                        type="submit"
                        disabled={sending}
                        className="group w-full label bg-ink text-paper px-8 py-5 hover:bg-verm transition-colors duration-300 disabled:opacity-60 inline-flex items-center justify-center gap-3"
                      >
                        {sending ? "SENDING…" : "SUBMIT REQUEST"}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                          →
                        </span>
                      </button>
                      <p className="label text-ink/45 leading-relaxed">
                        * REQUIRED · REPLY WITHIN ONE WORKING DAY · DETAILS
                        STAY IN THIS HOUSE
                      </p>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
