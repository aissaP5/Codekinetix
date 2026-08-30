"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useKinetix } from "@/lib/store";
import { sendInquiry, TARGET_EMAIL } from "@/lib/email";

const SERVICES = ["WEBSITES", "E-COMMERCE", "WEB APPS", "MOTION & UI", "OTHER"];
const BUDGETS = ["< $5K", "$5K – $10K", "$10K – $25K", "$25K+"];
const TIMELINES = ["1-2 WEEKS", "1 MONTH", "2-3 MONTHS", "FLEXIBLE"];

export default function ContactDrawer() {
  const contactOpen = useKinetix((s) => s.contactOpen);
  const closeContact = useKinetix((s) => s.closeContact);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "WEBSITES",
    budget: "$5K – $10K",
    timeline: "1 MONTH",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && contactOpen) {
        closeContact();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen, closeContact]);

  // Entrance & Exit animations
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (contactOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "block" });
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power4.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, {
        xPercent: 100,
        duration: 0.35,
        ease: "power3.in",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          if (status === "success") {
            setStatus("idle");
            setFormData({
              name: "",
              email: "",
              service: "WEBSITES",
              budget: "$5K – $10K",
              timeline: "1 MONTH",
              message: "",
            });
          }
        },
      });
    }
  }, [contactOpen, closeContact, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("PLEASE COMPLETE ALL REQUIRED FIELDS.");
      return;
    }

    setErrorMsg("");
    setStatus("sending");

    const res = await sendInquiry(formData);
    if (res.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(res.message || "FAILED TO TRANSMIT. PLEASE USE DIRECT EMAIL.");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[95] bg-void/80 backdrop-blur-md opacity-0 pointer-events-auto"
      style={{ display: "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0"
        onClick={closeContact}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-xl bg-panel text-bone border-l border-bone/15 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Technical Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-bone/10 bg-void">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-volt rotate-45" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-bone font-bold">
              TRANSMISSION // INQUIRY
            </span>
          </div>
          <button
            onClick={closeContact}
            className="group font-mono text-[10px] tracking-[0.2em] px-3 py-1.5 border border-bone/20 text-ash hover:border-volt hover:text-volt transition-colors [-webkit-tap-highlight-color:transparent]"
            aria-label="Close contact drawer"
          >
            CLOSE [ESC] ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-7 ck-scroll">
          {status === "success" ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-14 h-14 mx-auto grid place-items-center rounded-full border border-volt bg-volt/10 text-volt text-2xl font-bold">
                ✓
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[10px] tracking-[0.3em] text-volt">
                  TRANSMISSION RECEIVED
                </p>
                <h3 className="font-extrabold type-wide uppercase text-3xl sm:text-4xl text-bone">
                  MESSAGE DISPATCHED
                </h3>
                <p className="font-mono text-xs text-ash max-w-sm mx-auto leading-relaxed pt-2">
                  Direct copy delivered to <span className="text-volt">{TARGET_EMAIL}</span>. We review every brief and return a fixed scope quote within 24–48 hours.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={closeContact}
                  className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-7 py-3 rounded hover:bg-bone transition-colors"
                >
                  RETURN TO SITE ↗
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-volt mb-2">
                  START A PROJECT
                </p>
                <h2 className="font-extrabold type-xwide uppercase leading-[0.95] text-4xl sm:text-5xl text-bone tracking-tight">
                  LET&apos;S TALK.
                </h2>
                <p className="font-mono text-[10px] sm:text-xs text-ash mt-3 leading-relaxed">
                  Send details directly to <a href={`mailto:${TARGET_EMAIL}`} className="text-bone underline decoration-volt/50 hover:text-volt">{TARGET_EMAIL}</a>. Fixed quote in 48h.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 01 — Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                      01 // YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-void border border-bone/20 text-bone px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-volt rounded-none placeholder:text-bone/25"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                      02 // EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@studio.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-void border border-bone/20 text-bone px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-volt rounded-none placeholder:text-bone/25"
                    />
                  </div>
                </div>

                {/* 03 — Service Selection */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                    03 // PROJECT SCOPE
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setFormData({ ...formData, service: s })}
                        className={`font-mono text-[10px] tracking-[0.15em] px-3 py-2 border transition-colors ${
                          formData.service === s
                            ? "bg-volt border-volt text-void font-bold"
                            : "bg-void border-bone/15 text-bone/70 hover:border-bone/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 04 — Budget Range */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                    04 // ESTIMATED BUDGET (USD)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setFormData({ ...formData, budget: b })}
                        className={`font-mono text-[10px] tracking-[0.15em] py-2 border text-center transition-colors ${
                          formData.budget === b
                            ? "bg-volt border-volt text-void font-bold"
                            : "bg-void border-bone/15 text-bone/70 hover:border-bone/40"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 05 — Timeline */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                    05 // TARGET TIMELINE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIMELINES.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setFormData({ ...formData, timeline: t })}
                        className={`font-mono text-[10px] tracking-[0.15em] py-2 border text-center transition-colors ${
                          formData.timeline === t
                            ? "bg-volt border-volt text-void font-bold"
                            : "bg-void border-bone/15 text-bone/70 hover:border-bone/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 06 — Message */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] text-ash mb-2">
                    06 // PROJECT DETAILS / GOALS *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the product, timeline, references or specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-void border border-bone/20 text-bone p-3.5 font-mono text-xs focus:outline-none focus:border-volt rounded-none placeholder:text-bone/25 resize-y"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 border border-flame/40 bg-flame/10 font-mono text-[10px] tracking-wide text-flame">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full relative group overflow-hidden bg-volt text-void font-mono text-xs font-bold tracking-[0.25em] py-4 transition-transform active:scale-[0.99] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === "sending" ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-void border-t-transparent rounded-full animate-spin" />
                          TRANSMITTING INQUIRY...
                        </>
                      ) : (
                        <>
                          DISPATCH INQUIRY TO CODEKINETIX ↗
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-bone translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer Bar with direct info */}
        <div className="px-5 sm:px-8 py-3.5 border-t border-bone/10 bg-void flex items-center justify-between font-mono text-[9px] text-ash">
          <span>DESTINATION: {TARGET_EMAIL}</span>
          <span className="text-volt">RESPONSE: ≤ 48H</span>
        </div>
      </div>
    </div>
  );
}
