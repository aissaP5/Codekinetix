import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECT_SLOTS, getSlot, getNextSlot } from "@/lib/projects";
import CaseStudyClient from "./CaseStudyClient";

export async function generateStaticParams() {
  const slugs = [
    { slug: "pizza-man" },
    { slug: "pizzaman" },
    { slug: "bistro" },
    { slug: "bristo" },
    { slug: "pausa" },
    { slug: "lumea" },
    { slug: "marfil" },
    { slug: "smashe-d" },
    { slug: "smashd" },
  ];
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slot = getSlot(slug);
  if (!slot) return { title: "Case Study — CodeKinetix" };

  return {
    title: `${slot.name} — Case Study | CodeKinetix`,
    description: slot.description,
    openGraph: {
      title: `${slot.name} (${slot.tagline}) — Case Study | CodeKinetix`,
      description: slot.description,
      images: [{ url: slot.image }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slot = getSlot(slug);
  if (!slot) {
    notFound();
  }

  const nextSlot = getNextSlot(slot.id);

  return <CaseStudyClient slot={slot} nextSlot={nextSlot} />;
}
