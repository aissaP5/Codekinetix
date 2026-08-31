/**
 * Project registry — Works section.
 *
 * Every project is a real build living under /projects/<id>/ (see
 * scripts/embed-projects.mjs). Each one opens INSIDE this website
 * (embedded view) — never as an external link.
 */
export interface ProjectSlot {
  id: string;
  index: string; // display number, e.g. "01"
  name: string; // brand name shown on the card + transition wipe
  tagline: string; // one-line category, card top-right
  meta: string; // stack / context line, card bottom-left
  path: string; // embedded build served from public/
  image?: string;
  mobileImage?: string;
  video?: string;
  span: "wide" | "tall" | "normal";
}

export const PROJECT_SLOTS: ProjectSlot[] = [
  {
    id: "lumea",
    index: "01",
    name: "LUMÉA",
    tagline: "MAISON DE SKINCARE",
    meta: "BEAUTY — NEXT.JS",
    path: "/projects/lumea/index.html",
    image: "/media/Lumea.png",
    mobileImage: "/media/Lumea-mobile.png",
    video: "/media/lumea.mov",
    span: "tall",
  },
  {
    id: "marfil",
    index: "02",
    name: "MARFIL",
    tagline: "DENTAL HOUSE — MADRID",
    meta: "HEALTHCARE — NEXT.JS",
    path: "/projects/marfil/index.html",
    image: "/media/marfil.png",
    mobileImage: "/media/marfil-mobile.png",
    video: "/media/marfil.mov",
    span: "normal",
  },
  {
    id: "smashd",
    index: "03",
    name: "SMASH'D",
    tagline: "ANATOMY OF FLAVOR",
    meta: "FOOD — NEXT.JS",
    path: "/projects/smashd/index.html",
    image: "/media/smashed.png",
    mobileImage: "/media/smashed-mobile.png",
    video: "/media/smashed.mov",
    span: "normal",
  },
  {
    id: "pausa",
    index: "04",
    name: "PAUSA",
    tagline: "COFFEE & CHILL — LYON",
    meta: "CAFÉ — HTML / GSAP",
    path: "/projects/pausa/index.html",
    image: "/media/pausa.png",
    mobileImage: "/media/pausa-mobile.png",
    video: "/media/pausa.mov",
    span: "wide",
  },
  {
    id: "bistro",
    index: "05",
    name: "BISTRO",
    tagline: "A TASTE OF PERFECTION",
    meta: "DINING — HTML / CSS",
    path: "/projects/bistro/index.html",
    image: "/media/bristo.png",
    mobileImage: "/media/bristo-mobile.png",
    video: "/media/bristo.mov",
    span: "normal",
  },
  {
    id: "pizzaman",
    index: "06",
    name: "PIZZA-MAN!",
    tagline: "COMIC PIZZERIA — PARIS",
    meta: "FOOD — NEXT.JS",
    path: "/projects/pizzaman/index.html",
    image: "/media/pizzaman.png",
    mobileImage: "/media/pizzaman-mobile.png",
    video: "/media/pizzaman.mov",
    span: "normal",
  },
];

export const getSlot = (id: string | null | undefined): ProjectSlot | null =>
  PROJECT_SLOTS.find((s) => s.id === id) ?? null;
