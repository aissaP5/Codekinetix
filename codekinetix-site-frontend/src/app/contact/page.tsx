import type { Metadata } from "next";
import ProjectForm from "@/components/portfolio/ProjectForm";

export const metadata: Metadata = {
  title: "Start a Project — CodeKinetix Studio",
  description:
    "Have an idea? Let's build something different. Submit your project brief for bespoke websites, e-commerce storefronts, and custom web applications.",
};

export default function ContactPage() {
  return (
    <div className="px-4 sm:px-8 pt-10 sm:pt-16 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="font-extrabold type-xwide uppercase tracking-[-0.02em] text-bone text-4xl sm:text-6xl lg:text-7xl leading-[0.92] mb-6">
          HAVE AN IDEA?
          <br />
          <span className="text-volt">LET&apos;S BUILD SOMETHING DIFFERENT.</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-bone/65 leading-relaxed max-w-xl">
          Fill in your project specifications below. We review every brief directly and get back to you within 24 hours with a scope assessment.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ProjectForm />
      </div>
    </div>
  );
}
