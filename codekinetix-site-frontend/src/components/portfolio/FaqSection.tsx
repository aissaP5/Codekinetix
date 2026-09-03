"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How do you scope a project?",
    a: "Every project begins with an in-depth discovery phase to analyze your brand goals, required features, motion choreography, and technical architecture. We provide a structured roadmap and milestone delivery schedule before development begins.",
  },
  {
    q: "How long does a project take?",
    a: "Most bespoke marketing sites and landing experiences are delivered in 2 to 4 weeks. Larger web applications, headless e-commerce, or video-scrub engines take between 4 to 8 weeks with structured weekly design reviews.",
  },
  {
    q: "Do you work internationally?",
    a: "Yes. CodeKinetix operates globally with clients across Europe, North America, and North Africa. We use streamlined asynchronous communication, Figma reviews, and Loom walkthroughs to keep projects moving across any timezone.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Absolutely. We specialize in transforming outdated, slow, or template-based websites into bespoke high-performance experiences with modern design, GSAP motion, and improved conversion architecture.",
  },
  {
    q: "Do you provide hosting?",
    a: "We deploy client projects to modern high-speed global Edge networks (such as Vercel, Cloudflare Pages, or AWS) configured with SSL, custom domains, and automated CI/CD deployments. We assist with domain setup and full handoff.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Yes. Every project includes a 30-day post-launch warranty. Afterwards, we offer ongoing retainer packages for performance monitoring, content updates, feature additions, and security patches.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 sm:px-8 py-20 sm:py-28 border-t border-bone/10 bg-void" aria-label="Frequently Asked Questions">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <h2 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
            COMMON QUESTIONS.
          </h2>
        </div>
        <p className="font-mono text-xs text-bone/60 max-w-md leading-relaxed">
          Straightforward answers about our collaboration model, timelines, and technical standards.
        </p>
      </div>

      <div className="border-y border-bone/10 divide-y divide-bone/10">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.q} className="group">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full py-6 sm:py-8 flex items-center justify-between text-left gap-4 focus:outline-none [-webkit-tap-highlight-color:transparent]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-mono text-xs text-ash font-bold">0{i + 1}</span>
                  <span className="font-extrabold type-wide uppercase text-lg sm:text-2xl text-bone group-hover:text-volt transition-colors">
                    {faq.q}
                  </span>
                </div>
                <span
                  className={`grid place-items-center w-8 h-8 rounded-full border border-bone/20 font-mono text-sm text-bone transition-transform duration-300 ${
                    isOpen ? "rotate-45 bg-volt text-void border-volt font-bold" : "group-hover:border-volt"
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="pb-8 pl-8 sm:pl-12 pr-4 max-w-3xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="font-mono text-xs sm:text-sm text-bone/75 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
