import type { Metadata } from "next";
import AboutView from "@/components/portfolio/AboutView";

export const metadata: Metadata = {
  title: "About — Independent Web Studio",
  description:
    "CodeKinetix is an independent freelance web studio. We design and build websites, e-commerce and web applications.",
};

export default function AboutPage() {
  return <AboutView />;
}
