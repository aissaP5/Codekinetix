/**
 * Project registry & Case Studies — Works section.
 *
 * Every project represents a real build living under /projects/<id>/
 * (see scripts/embed-projects.mjs) with rich, authentic case study data.
 */

export interface CaseStudyData {
  challenge: string;
  approach: string;
  design: string;
  experience: string;
  technology: string[];
  role: string;
  timeline: string;
  deliverables: string[];
  liveUrl: string;
  embedPath: string;
}

export interface ProjectSlot {
  id: string;
  slug: string;
  index: string; // display number, e.g. "01"
  name: string; // brand name shown on the card + transition wipe
  tagline: string; // one-line category, card top-right
  category: "E-COMMERCE" | "HEALTHCARE" | "DINING & HOSPITALITY" | "EXPERIENCE" | "FOOD";
  meta: string; // stack / context line, card bottom-left
  description: string;
  path: string; // embedded build served from public/
  image: string;
  mobileImage?: string;
  video?: string;
  span: "wide" | "tall" | "normal";
  caseStudy: CaseStudyData;
}

export const PROJECT_SLOTS: ProjectSlot[] = [
  {
    id: "lumea",
    slug: "lumea",
    index: "01",
    name: "LUMÉA",
    tagline: "MAISON DE SKINCARE",
    category: "E-COMMERCE",
    meta: "BEAUTY — NEXT.JS / LENIS",
    description:
      "A high-fashion luxury skincare editorial storefront blending haute-couture typography, smooth kinetic momentum, and instant checkout flows.",
    path: "/projects/lumea/index.html",
    image: "/media/Lumea.png",
    mobileImage: "/media/Lumea-mobile.png",
    video: "/media/lumea.mov",
    span: "tall",
    caseStudy: {
      challenge:
        "Luxury beauty e-commerce often suffers from generic, template-driven product grids that strip high-end formulations of their tactile craftsmanship and bespoke prestige.",
      approach:
        "We engineered an asymmetrical editorial layout inspired by high-fashion print magazines, combining Cormorant Garamond display typography, ivory/rose palettes, and fluid kinetic momentum.",
      design:
        "Curated palette of Cream (#FAF7F1), Ivory (#F3EDE2), Linen, and Rose Blush. Generous editorial whitespace pairs with bespoke typography pairings to evoke sensorial luxury.",
      experience:
        "Lenis-powered momentum scrolling, interactive ingredients ledger, staggered letter preloaders, and an instant slide-out shopping bag drawer engineered with pure React Context.",
      technology: [
        "Next.js 16 (App Router)",
        "React 19",
        "Tailwind CSS v4",
        "Lenis Kinetic Scroll",
        "TypeScript",
        "Context API Drawer",
      ],
      role: "Digital Direction, UI/UX Design, Front-End Engineering & Motion",
      timeline: "3 Weeks",
      deliverables: [
        "Interactive Storefront",
        "Micro-Animation Engine",
        "Shopping Bag Drawer",
        "Editorial Typography System",
      ],
      liveUrl: "/projects/lumea/index.html",
      embedPath: "/projects/lumea/index.html",
    },
  },
  {
    id: "marfil",
    slug: "marfil",
    index: "02",
    name: "MARFIL",
    tagline: "DENTAL HOUSE — MADRID",
    category: "HEALTHCARE",
    meta: "HEALTHCARE — NEXT.JS / TAILWIND",
    description:
      "An architectural clinical atlas for an exclusive private dental clinic located at Calle de Serrano 47 in Madrid.",
    path: "/projects/marfil/index.html",
    image: "/media/marfil.png",
    mobileImage: "/media/marfil-mobile.png",
    video: "/media/marfil.mov",
    span: "normal",
    caseStudy: {
      challenge:
        "Traditional dental websites are sterile, clinical, and intimidating. Marfil required an editorial identity that projects architectural serenity, surgical precision, and unquestionable trust.",
      approach:
        "Constructed a clean, gallery-grade layout structure around high-fidelity photography, subtle stone/charcoal color harmonies, and structured treatment atlases.",
      design:
        "High-contrast editorial typography, minimal hairline border grids, and serene monochrome treatments reflecting the physical clinic's limestone interior in Madrid.",
      experience:
        "Interactive clinical consultation booking modal, treatment portfolio drawers, and location atlas with responsive touch controls.",
      technology: [
        "Next.js 16",
        "React 19",
        "Tailwind CSS v4",
        "TypeScript",
        "Lucide Icons",
        "Interactive Booking Engine",
      ],
      role: "Brand Digitalization, UI/UX Architecture, Front-End Development",
      timeline: "3 Weeks",
      deliverables: [
        "Clinical Atlas Platform",
        "Consultation Booking System",
        "Responsive Mobile Experience",
        "Brand Identity Transition",
      ],
      liveUrl: "/projects/marfil/index.html",
      embedPath: "/projects/marfil/index.html",
    },
  },
  {
    id: "smashd",
    slug: "smashe-d",
    index: "03",
    name: "SMASH'D",
    tagline: "ANATOMY OF FLAVOR",
    category: "EXPERIENCE",
    meta: "FOOD — NEXT.JS / GSAP VIDEO SCRUB",
    description:
      "A high-octane, dark-mode culinary experience featuring an interactive 100-frame burger anatomy scrub engine.",
    path: "/projects/smashd/index.html",
    image: "/media/smashed.png",
    mobileImage: "/media/smashed-mobile.png",
    video: "/media/smashed.mov",
    span: "normal",
    caseStudy: {
      challenge:
        "Standing out in the crowded street food market required a visceral digital experience that demonstrates culinary quality and ingredient craft beyond static photos.",
      approach:
        "Built a custom 100-frame video scrub engine synchronized with GSAP ScrollTrigger, allowing users to disassemble and inspect the burger layer by layer in real time.",
      design:
        "Brutal ink black backgrounds, glowing ember highlights, gold toasted accents, and heavy typography evoking the sizzle and heat of the griddle.",
      experience:
        "Continuous 360-degree rotation scrub on scroll, physics-based 3D card tilt on desktop, interactive secret sauce explorer, and instant menu filtering.",
      technology: [
        "Next.js 16",
        "GSAP ScrollTrigger",
        "Video Scrub Engine (Canvas / Frame Sequencer)",
        "Tailwind CSS v4",
        "React 19",
      ],
      role: "Creative Direction, Motion Engineering, Full-Stack Front-End",
      timeline: "4 Weeks",
      deliverables: [
        "Interactive Frame Scrub Engine",
        "Menu Explorer & Customizer",
        "Motion Design System",
        "3D Physics Interaction",
      ],
      liveUrl: "/projects/smashd/index.html",
      embedPath: "/projects/smashd/index.html",
    },
  },
  {
    id: "pausa",
    slug: "pausa",
    index: "04",
    name: "PAUSA",
    tagline: "COFFEE & CHILL — LYON",
    category: "DINING & HOSPITALITY",
    meta: "CAFÉ — HTML / GSAP",
    description:
      "An artisanal digital haven for a specialty third-wave coffee roastery based in Lyon, France.",
    path: "/projects/pausa/index.html",
    image: "/media/pausa.png",
    mobileImage: "/media/pausa-mobile.png",
    video: "/media/pausa.mov",
    span: "wide",
    caseStudy: {
      challenge:
        "Capturing the relaxed, slow-living ritual of artisanal coffee culture while providing clear menu discovery and origin transparency.",
      approach:
        "Designed warm, tactile earth tones and kinetic typography rhythms that evoke the aroma, roasting notes, and gentle pace of the coffee house.",
      design:
        "Rich terracotta, warm crema, roasted espresso browns, and modern serif headings structured with clean minimalist spacing.",
      experience:
        "Smooth GSAP-driven section reveals, roast profile comparison sliders, and interactive menu ledger with detailed origin notes.",
      technology: [
        "Semantic HTML5",
        "GSAP Animation Suite",
        "Modern CSS Grid & Flexbox",
        "Vanilla JavaScript",
        "Responsive Typography",
      ],
      role: "Concept, Web Design, Animation & Development",
      timeline: "2 Weeks",
      deliverables: [
        "Specialty Roastery Site",
        "Origin & Roast Guide",
        "Kinetic Menu Experience",
        "Mobile-First Optimization",
      ],
      liveUrl: "/projects/pausa/index.html",
      embedPath: "/projects/pausa/index.html",
    },
  },
  {
    id: "bistro",
    slug: "bistro",
    index: "05",
    name: "BISTRO",
    tagline: "A TASTE OF PERFECTION",
    category: "DINING & HOSPITALITY",
    meta: "DINING — HTML / CSS / GSAP",
    description:
      "A timeless fine-dining gastronomic portal celebrating seasonal degustation menus and intimate culinary craft.",
    path: "/projects/bistro/index.html",
    image: "/media/bristo.png",
    mobileImage: "/media/bristo-mobile.png",
    video: "/media/bristo.mov",
    span: "normal",
    caseStudy: {
      challenge:
        "Creating an elevated online presence for a fine dining establishment that translates gastronomic prestige into seamless table reservation bookings.",
      approach:
        "Applied classical editorial proportions, dramatic culinary photography, and smooth entrance reveals that emulate the pacing of a multi-course dinner.",
      design:
        "Deep obsidian palette, gold leaf accents, crisp white typography, and delicate micro-borders creating an aura of exclusivity.",
      experience:
        "Interactive seasonal menu browser, wine pairing discovery list, and frictionless table reservation flow.",
      technology: [
        "HTML5 / CSS3",
        "GSAP Kinetic Tweens",
        "JavaScript ES6+",
        "Responsive Media Queries",
      ],
      role: "UI/UX Design, Visual Styling, Web Development",
      timeline: "2 Weeks",
      deliverables: [
        "Gastronomy Showcase",
        "Degustation Menu Ledger",
        "Reservation Integration",
        "High-Performance Imagery",
      ],
      liveUrl: "/projects/bistro/index.html",
      embedPath: "/projects/bistro/index.html",
    },
  },
  {
    id: "pizzaman",
    slug: "pizza-man",
    index: "06",
    name: "PIZZA-MAN!",
    tagline: "COMIC PIZZERIA — PARIS",
    category: "FOOD",
    meta: "FOOD — NEXT.JS / GSAP COMIC UI",
    description:
      "A pop-art comic-book pizzeria with high-voltage energy, 20-minute Paris delivery promise, and reactive pizza cart.",
    path: "/projects/pizzaman/index.html",
    image: "/media/pizzaman.png",
    mobileImage: "/media/pizzaman-mobile.png",
    video: "/media/pizzaman.mov",
    span: "normal",
    caseStudy: {
      challenge:
        "Pizzerias typically rely on generic aggregator apps that dilute brand personality and charge high merchant commissions.",
      approach:
        "Built a bold, comic-book aesthetic packed with halftone bursts, thick graphic black strokes, and a proprietary reactive cart that makes direct ordering fun and instant.",
      design:
        "Halftone dot patterns, comic-red sunbursts, bold action bubble typography, and nostalgic 90s superhero styling.",
      experience:
        "Dynamic pizza menu filtering, interactive crust/topping customizer, live cart tray, and 20-minute delivery guarantee ticker.",
      technology: [
        "Next.js 16 (Static Export)",
        "React 19",
        "Tailwind CSS v4",
        "GSAP Timeline Animations",
        "Client-Side Cart Store",
      ],
      role: "Brand Digital Experience, Creative Coding, Front-End Architecture",
      timeline: "3 Weeks",
      deliverables: [
        "Pop-Art Comic Web Experience",
        "Interactive Order & Cart Engine",
        "Static Menu Route (/menu)",
        "Mobile Ordering Flow",
      ],
      liveUrl: "/projects/pizzaman/index.html",
      embedPath: "/projects/pizzaman/index.html",
    },
  },
];

/**
 * Helper to look up project by ID or Slug (with alias support)
 */
export function getSlot(identifier: string | null | undefined): ProjectSlot | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();

  // Handle common alias normalization
  const normalized =
    clean === "bristo"
      ? "bistro"
      : clean === "smashd"
      ? "smashe-d"
      : clean === "pizza-man"
      ? "pizzaman"
      : clean;

  return (
    PROJECT_SLOTS.find(
      (s) => s.id === clean || s.slug === clean || s.id === normalized || s.slug === normalized
    ) ?? null
  );
}

export function getNextSlot(currentId: string): ProjectSlot {
  const currentIndex = PROJECT_SLOTS.findIndex((s) => s.id === currentId || s.slug === currentId);
  if (currentIndex === -1 || currentIndex === PROJECT_SLOTS.length - 1) {
    return PROJECT_SLOTS[0];
  }
  return PROJECT_SLOTS[currentIndex + 1];
}
