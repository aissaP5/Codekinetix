import type { Metadata } from "next";
import CareerView from "@/components/portfolio/CareerView";

export const metadata: Metadata = {
  title: "Career — Timeline & Trajectory",
  description:
    "Explore the CodeKinetix trajectory from 2021 to 2026, shipping high-fidelity web experiences, applications, and digital storefronts.",
};

export default function CareerPage() {
  return <CareerView />;
}
