import type { Metadata } from "next";
import WorksView from "@/components/portfolio/WorksView";

export const metadata: Metadata = {
  title: "Works — Selected Projects",
  description:
    "Explore selected projects designed and built by CodeKinetix, featuring embedded live preview builds and high-energy interactive experiences.",
};

export default function WorksPage() {
  return <WorksView />;
}
