import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — CodeKinetix Studio",
  description:
    "Terms of Service governing the use of CodeKinetix website, client engagements, creative engineering services, and bespoke web development contracts.",
};

const SECTIONS = [
  {
    num: "01",
    tag: "AGREEMENT & SCOPE",
    title: "ACCEPTANCE OF TERMS",
    content: [
      "By accessing or utilizing the CodeKinetix website (codekinetix.dev), requesting project proposals, or entering into a contractual engagement with CodeKinetix Studio ('we', 'us', 'our'), you ('Client', 'User') agree to be bound by these Terms of Service.",
      "These Terms, in conjunction with any specific Statement of Work (SOW), Proposal, or Service Agreement signed between the parties, constitute the entire agreement governing our commercial relationship.",
    ],
  },
  {
    num: "02",
    tag: "STUDIO OFFERINGS",
    title: "SERVICES & COMMISSIONS",
    content: [
      "CodeKinetix provides bespoke digital experience engineering, including but not limited to:",
      "• Flagship brand websites, editorial architectures, and high-performance landing pages.",
      "• Custom e-commerce storefronts, checkout workflows, and headless CMS integrations.",
      "• Full-stack web applications, customer portals, and internal dashboard interfaces.",
      "• Creative front-end development, GSAP animation choreographies, and WebGL/Canvas kinetic systems.",
      "Specific deliverables, timelines, milestones, and technical specifications are defined in each project's bespoke Statement of Work.",
    ],
  },
  {
    num: "03",
    tag: "INTELLECTUAL PROPERTY",
    title: "OWNERSHIP & IP RIGHTS",
    content: [
      "Client Deliverables: Upon complete payment of all project fees, the Client receives full ownership rights to the final bespoke design layouts, client-specific codebases, and custom graphics created exclusively for the project.",
      "Studio Background IP: CodeKinetix retains all rights, title, and interest in and to our proprietary starter boilerplates, reusable utilities, generic animation curves, custom hooks, and workflow tooling developed prior to or independently of the project. The Client is granted an irrevocable, perpetual, worldwide, non-exclusive license to use such studio IP incorporated into the final deliverable.",
      "Portfolio Showcase: Unless explicitly restricted via a signed Non-Disclosure Agreement (NDA), CodeKinetix retains the right to display the completed work, case study documentation, interactive recordings, and brand marks within our studio portfolio and promotional channels.",
    ],
  },
  {
    num: "04",
    tag: "COMMERCIAL TERMS",
    title: "PROPOSALS, PAYMENTS & MILESTONES",
    content: [
      "Deposit & Commencement: Project work begins upon receipt of the agreed initial deposit (typically 50% upon contract signing) and all required briefing materials.",
      "Milestone Invoicing: Subsequent payments are scheduled against agreed delivery milestones (e.g., Design Approval, Staging Preview, and Final Production Handoff).",
      "Payment Terms: Invoices are payable within 14 calendar days of issuance. Work may be paused if outstanding milestone balances remain unpaid past the due date.",
      "Scope Revisions: Any features or design requests exceeding the agreed Statement of Work will be scoped separately via formal Change Requests at our prevailing hourly or daily rate.",
    ],
  },
  {
    num: "05",
    tag: "CLIENT RESPONSIBILITIES",
    title: "MATERIALS, FEEDBACK & TIMELINES",
    content: [
      "Assets & Copy: The Client is responsible for supplying high-resolution brand assets, typography licenses, copy, photography, and third-party API credentials necessary for timely project execution.",
      "Legal Clearances: The Client warrants that all assets provided do not infringe upon any third-party intellectual property or copyright laws.",
      "Timely Approvals: Project timelines depend directly on prompt Client feedback. Prolonged delays in milestone approvals or review rounds may result in rescheduled completion dates.",
    ],
  },
  {
    num: "06",
    tag: "QUALITY ASSURANCE",
    title: "WARRANTY & PERFORMANCE STANDARDS",
    content: [
      "Code Quality: All code is engineered to strict modern web standards, emphasizing sub-second loading performance, responsive stability across standard device viewports, and clean semantic architecture.",
      "Browser Compatibility: Websites are tested and verified on the latest stable releases of major modern browsers: Chrome, Safari, Edge, and Firefox.",
      "Post-Launch Warranty: Every custom build includes a complimentary 30-day bug-fixing warranty from the deployment date to resolve any unforeseen technical defects within the original scope.",
    ],
  },
  {
    num: "07",
    tag: "LEGAL SAFEGUARDS",
    title: "LIMITATION OF LIABILITY",
    content: [
      "To the maximum extent permitted by applicable law, CodeKinetix shall not be held liable for indirect, incidental, punitive, or consequential damages (including loss of profits, business interruption, or data corruption) arising from the use or inability to use our deliverables.",
      "In any circumstance, our aggregate liability arising under or relating to any project engagement shall not exceed the total project fees paid to CodeKinetix for the specific services giving rise to the claim.",
    ],
  },
  {
    num: "08",
    tag: "TERMINATION & DISPUTES",
    title: "TERMINATION & GOVERNING LAW",
    content: [
      "Either party may terminate a project agreement upon 14 days written notice if the other party breaches any material term and fails to cure such breach within that period.",
      "In the event of early termination, the Client shall pay for all hours logged and milestones completed up to the date of notice, and CodeKinetix will deliver all work-in-progress completed to date.",
      "These terms and all related client agreements shall be governed by and construed in accordance with applicable commercial laws, with disputes settled amicably before arbitration.",
    ],
  },
  {
    num: "09",
    tag: "DIRECT COMM",
    title: "QUESTIONS & CONTACT",
    content: [
      "For questions regarding our terms, custom contract frameworks, or commercial master service agreements (MSAs):",
      "Email: codekinetixstudio@gmail.com",
      "We believe in straightforward terms and direct communication.",
    ],
  },
];

export default function TermsOfServicePage() {
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
        <span className="text-volt font-bold">LEGAL // 02</span>
      </div>

      {/* Hero Header */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-16 pb-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 font-mono text-xs text-volt uppercase tracking-[0.3em] mb-4">
            <span>COMMERCIAL FRAMEWORK</span>
            <span className="w-1 h-1 rounded-full bg-volt" />
            <span>LAST UPDATED: MARCH 2026</span>
          </div>

          <h1 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
            TERMS OF SERVICE.
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-bone/80 leading-snug max-w-2xl mb-10">
            Clear terms. Rigorous engineering. We build partnerships grounded in mutual respect, clear expectations, and creative excellence.
          </p>

          {/* Quick Summary Callout */}
          <div className="p-6 sm:p-8 border border-volt/30 bg-panel/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-volt" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-volt uppercase font-bold block mb-2">
              COMMERCIAL OVERVIEW
            </span>
            <p className="font-mono text-xs sm:text-sm text-bone/70 leading-relaxed">
              CodeKinetix is an independent digital experience studio. We build custom websites, e-commerce stores, and web apps from raw code. You own your custom design and code deliverables; we retain our proprietary starter utilities and the right to showcase the work.
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
            href="/privacy"
            className="group inline-flex items-center gap-2 text-bone/70 hover:text-volt transition-colors uppercase tracking-wider"
          >
            VIEW PRIVACY POLICY
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
