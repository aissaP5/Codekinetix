"use client";

import { useState } from "react";
import { sendInquiry } from "@/lib/email";

const PROJECT_TYPES = [
  { label: "Brand Website", category: "Flagship Site" },
  { label: "Online Store", category: "E-Commerce" },
  { label: "Web Application", category: "Full-Stack Portal" },
  { label: "Complete Redesign", category: "Visual & UX Overhaul" },
  { label: "Custom Motion / 3D", category: "Interactive Experience" },
];

const STYLE_VIBES = [
  "Dark & Monumental",
  "Minimal & High-Contrast",
  "Luxury & Refined",
  "High-Energy & Motion-Heavy",
  "Clean & Structured",
  "Experimental & Unconventional",
];

export default function ProjectForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    email: "",
    type: "",
    style: "",
    details: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const canProceed = () => {
    if (step === 0) return formData.type.length > 0;
    if (step === 1) return formData.style.length > 0;
    if (step === 2) return formData.name.trim().length > 0 && formData.email.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setFeedback("Please fill out your name and email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    const res = await sendInquiry({
      name: formData.name,
      email: formData.email,
      service: formData.type,
      budget: formData.style,
      timeline: "Flexible",
      message: `Brand: ${formData.brand || "—"}\nStyle Preference: ${formData.style}\nProject Type: ${formData.type}\n\nProject Scope & Notes:\n${formData.details}`,
    });

    if (res.success) {
      setStatus("success");
      setFeedback("Brief received. We will respond within 24 hours.");
    } else {
      setStatus("error");
      setFeedback(res.message || "Failed to transmit. Please email directly: codekinetixstudio@gmail.com");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-panel/70 border border-volt/30 p-8 sm:p-14 text-center">
        <span className="inline-block w-3 h-3 bg-volt rotate-45 mb-6" />
        <h3 className="font-extrabold type-xwide uppercase text-2xl sm:text-3xl text-bone mb-3">
          TRANSMISSION RECEIVED.
        </h3>
        <p className="text-bone/60 text-sm leading-relaxed max-w-md mx-auto">
          We review every brief personally and return our initial technical assessment and scope outline within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-panel/70 border border-bone/15 overflow-hidden">
      {/* Step Indicator Header */}
      <div className="flex border-b border-bone/10 bg-void/60 text-[10px] font-mono tracking-widest text-bone/40">
        <div className={`flex-1 py-3 px-4 text-center border-r border-bone/10 ${step === 0 ? "text-volt font-bold bg-volt/5" : ""}`}>
          01. SCOPE
        </div>
        <div className={`flex-1 py-3 px-4 text-center border-r border-bone/10 ${step === 1 ? "text-volt font-bold bg-volt/5" : ""}`}>
          02. AESTHETIC
        </div>
        <div className={`flex-1 py-3 px-4 text-center ${step === 2 ? "text-volt font-bold bg-volt/5" : ""}`}>
          03. DETAILS
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* Step 0 — What do you need? */}
        {step === 0 && (
          <div>
            <h3 className="font-extrabold type-xwide uppercase text-xl sm:text-2xl text-bone mb-2">
              Select project scope
            </h3>
            <p className="text-bone/50 text-sm mb-8">
              What type of experience are we crafting for you?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.label}
                  onClick={() => setFormData({ ...formData, type: t.label })}
                  className={`p-4 sm:p-5 border text-left transition-all duration-300 ${
                    formData.type === t.label
                      ? "bg-volt text-void border-volt font-bold shadow-lg"
                      : "bg-void/60 border-bone/10 text-bone/70 hover:border-bone/30 hover:text-bone"
                  }`}
                >
                  <span className={`block font-extrabold type-wide uppercase text-sm mb-1 ${formData.type === t.label ? "text-void" : "text-bone"}`}>
                    {t.label}
                  </span>
                  <span className={`font-mono text-[10px] tracking-wider block ${formData.type === t.label ? "text-void/80" : "text-bone/40"}`}>
                    {t.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — What style do you like? */}
        {step === 1 && (
          <div>
            <h3 className="font-extrabold type-xwide uppercase text-xl sm:text-2xl text-bone mb-2">
              Visual direction & tone
            </h3>
            <p className="text-bone/50 text-sm mb-8">
              Select the atmosphere that matches your brand ambition.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLE_VIBES.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setFormData({ ...formData, style: v })}
                  className={`p-4 border font-mono text-xs tracking-wider text-left transition-all duration-300 ${
                    formData.style === v
                      ? "bg-volt text-void border-volt font-bold shadow-lg"
                      : "bg-void/60 border-bone/10 text-bone/70 hover:border-bone/30 hover:text-bone"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Client details */}
        {step === 2 && (
          <div>
            <h3 className="font-extrabold type-xwide uppercase text-xl sm:text-2xl text-bone mb-2">
              Project specifics
            </h3>
            <p className="text-bone/50 text-sm mb-8">
              Tell us where to direct your custom proposal.
            </p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-bone/40 font-mono text-[10px] tracking-wider uppercase mb-1.5">
                    Your name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-void border border-bone/15 px-4 py-3.5 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-volt transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-bone/40 font-mono text-[10px] tracking-wider uppercase mb-1.5">
                    Brand / Company
                  </label>
                  <input
                    type="text"
                    placeholder="Studio or Company Name"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-void border border-bone/15 px-4 py-3.5 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-volt transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-bone/40 font-mono text-[10px] tracking-wider uppercase mb-1.5">
                  Email address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@brand.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-void border border-bone/15 px-4 py-3.5 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-volt transition-colors"
                />
              </div>
              <div>
                <label className="block text-bone/40 font-mono text-[10px] tracking-wider uppercase mb-1.5">
                  Scope description & reference links
                </label>
                <textarea
                  rows={3}
                  placeholder="Key deliverables, timeline targets, benchmark websites..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-void border border-bone/15 p-4 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-volt transition-colors resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 border font-mono text-xs ${
              status === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-volt/10 border-volt/30 text-bone"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-bone/10">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => { setStep(step - 1); setFeedback(""); }}
              className="font-mono text-xs text-bone/50 hover:text-bone transition-colors uppercase tracking-wider"
            >
              ← BACK
            </button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => { setStep(step + 1); setFeedback(""); }}
              className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3.5 uppercase hover:bg-bone transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              CONTINUE →
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed() || status === "submitting"}
              onClick={handleSubmit}
              className="bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3.5 uppercase hover:bg-bone transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "TRANSMITTING..." : "SUBMIT BRIEF ↗"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
