import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CodeKinetix Studio",
  description:
    "Privacy Policy for CodeKinetix Digital Experience Studio. Learn how we handle your information with absolute transparency, minimal data collection, and strict security.",
};

const SECTIONS = [
  {
    num: "01",
    tag: "OVERVIEW & PRINCIPLES",
    title: "OUR PRIVACY PHILOSOPHY",
    content: [
      "CodeKinetix operates as an independent digital experience studio. We believe personal privacy is fundamental. We do not sell, rent, monetize, or trade your personal information.",
      "We collect only the bare minimum information required to review project inquiries, communicate proposals, execute bespoke creative engineering contracts, and provide technical support.",
    ],
  },
  {
    num: "02",
    tag: "DATA COLLECTION",
    title: "INFORMATION WE COLLECT",
    content: [
      "Project Inquiries: When you submit a project brief or email us directly, we collect your name, email address, brand/organization name, project requirements, style preferences, and any additional technical notes you provide.",
      "Direct Communication: Any correspondence conducted via email, video conference, or messaging platforms regarding scope, milestones, or technical specifications.",
      "Server & Edge Logs: When accessing our website, our edge CDN infrastructure automatically logs standard technical metadata (IP address, browser user-agent, request timestamps, and referrers) strictly for DDoS mitigation, performance optimization, and operational security.",
    ],
  },
  {
    num: "03",
    tag: "COOKIES & TELEMETRY",
    title: "COOKIES & TRACKING TECHNOLOGIES",
    content: [
      "We do not employ intrusive tracking cookies, third-party advertising pixels (such as Meta Pixel or Google Ads trackers), or invasive session replay recorders.",
      "Any cookies utilized are strictly operational, functional, or lightweight session markers essential to deliver seamless navigation and maintain UI state across your browsing session.",
    ],
  },
  {
    num: "04",
    tag: "USAGE OF DATA",
    title: "HOW WE USE COLLECTED DATA",
    content: [
      "Evaluating project feasibility, creating architectural proposals, and calculating timeline/budget estimates.",
      "Directly liaising with clients during design sprints, development cycles, and production deployment.",
      "Issuing formal service agreements, invoicing, accounting, and satisfying statutory compliance obligations.",
      "Maintaining the stability, security, and sub-second performance of our studio digital infrastructure.",
    ],
  },
  {
    num: "05",
    tag: "THIRD-PARTY INFRASTRUCTURE",
    title: "SERVICE PROVIDERS & SUB-PROCESSORS",
    content: [
      "We partner only with vetted, security-compliant cloud and infrastructure providers to host and deliver our web experiences:",
      "• Edge Hosting & CDN: Global edge networks (such as Vercel and Cloudflare) for ultra-low latency content delivery and firewall defense.",
      "• Transactional Email: Encrypted SMTP/API transport services to route project inquiries securely to our studio inbox.",
      "All service providers are bound by strict data processing and confidentiality agreements complying with global privacy frameworks.",
    ],
  },
  {
    num: "06",
    tag: "STORAGE & PROTECTION",
    title: "DATA RETENTION & SECURITY",
    content: [
      "We implement industry-standard cryptographic protocols (TLS 1.3 encryption in transit) and strict access controls across our internal environments.",
      "Inquiry and project data is retained only for the duration necessary to satisfy the commercial and legal purpose for which it was gathered, or until you request its permanent deletion.",
    ],
  },
  {
    num: "07",
    tag: "LEGAL RIGHTS",
    title: "YOUR RIGHTS (GDPR & CCPA COMPLIANCE)",
    content: [
      "Regardless of your geographical location, you have the right to:",
      "• Access: Request a copy of the personal information we hold regarding your inquiries.",
      "• Rectification: Request correction of inaccurate, outdated, or incomplete details.",
      "• Erasure: Request permanent deletion ('Right to be Forgotten') of your records from our systems.",
      "• Restriction & Objection: Object to or restrict the processing of your data at any time.",
    ],
  },
  {
    num: "08",
    tag: "INQUIRIES",
    title: "CONTACT THE STUDIO",
    content: [
      "For privacy requests, data deletion inquiries, or clarifications regarding these terms, reach our studio directly:",
      "Email: codekinetixstudio@gmail.com",
      "Direct communication guaranteed within 48 hours.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-16 sm:pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="px-4 sm:px-8 pt-8 pb-4 border-b border-bone/10 flex items-center justify-between font-mono text-[10px] tracking-widest text-ash uppercase">
        <Link
          href="/"
          className="hover:text-volt transition-colors flex items-center gap-1.5"
        >
          ← BACK TO STUDIO
        </Link>
        <span className="text-volt font-bold">LEGAL // 01</span>
      </div>

      {/* Hero Header */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-16 pb-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 font-mono text-xs text-volt uppercase tracking-[0.3em] mb-4">
            <span>LEGAL DOCUMENTATION</span>
            <span className="w-1 h-1 rounded-full bg-volt" />
            <span>LAST UPDATED: MARCH 2026</span>
          </div>

          <h1 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
            PRIVACY POLICY.
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-bone/80 leading-snug max-w-2xl mb-10">
            Absolute transparency. Zero tracking bloat. We protect your data with the same rigor we engineer our code.
          </p>

          {/* Quick Summary Callout */}
          <div className="p-6 sm:p-8 border border-volt/30 bg-panel/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-volt" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-volt uppercase font-bold block mb-2">
              EXECUTIVE SUMMARY
            </span>
            <p className="font-mono text-xs sm:text-sm text-bone/70 leading-relaxed">
              We collect information solely to communicate with prospective clients, evaluate project briefs, and deliver bespoke digital products. We do not sell your personal data, employ ad-tech surveillance scripts, or track you across the internet.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Sections */}
      <section className="px-4 sm:px-8 py-8 border-t border-bone/10">
        <div className="max-w-4xl space-y-12">
          {SECTIONS.map((sec) => (
            <article
              key={sec.num}
              className="p-6 sm:p-10 border border-bone/12 bg-panel/30 hover:border-volt/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-bone/10">
                <span className="font-mono text-xs tracking-[0.3em] text-volt uppercase font-bold">
                  {sec.tag}
                </span>
                <span className="font-mono text-xs text-bone/30">{sec.num}</span>
              </div>

              <h2 className="font-extrabold type-wide uppercase text-xl sm:text-2xl text-bone mb-4">
                {sec.title}
              </h2>

              <div className="space-y-3 font-mono text-xs sm:text-sm text-bone/70 leading-relaxed">
                {sec.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer Nav Links */}
      <section className="px-4 sm:px-8 pt-8">
        <div className="max-w-4xl flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-bone/10 font-mono text-xs">
          <Link
            href="/terms"
            className="group inline-flex items-center gap-2 text-bone/70 hover:text-volt transition-colors uppercase tracking-wider"
          >
            VIEW TERMS OF SERVICE
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-volt text-void font-mono text-xs font-bold tracking-[0.2em] px-6 py-3 uppercase hover:bg-bone transition-colors"
          >
            START A PROJECT ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
