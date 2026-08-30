export interface BurgerLayer {
  name: string;
  src: string;
  /** Position within the burger window (percentages of 1000x1024) */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Z offset (px) when exploded — positive = toward camera */
  z: number;
  /** slight rotation for style when exploded */
  rx: number;
  label: string;
  sub: string;
  /** accent color for the label */
  color: string;
}

export const BURGER_WINDOW = { w: 1000, h: 1024 };

/** The user's original hero render (masked, transparent background) */
export const HERO_BURGER = "/burger/Hamburger-removebg-preview.png";

export const BURGER_LAYERS: BurgerLayer[] = [
  {
    name: "top_bun",
    src: "/burger/top_bun.webp",
    left: 8.0, top: 0.0, width: 84.0, height: 57.14,
    z: 340, rx: 8,
    label: "BRIOCHE CROWN",
    sub: "Butter-brushed · sesame seeded",
    color: "#F2B04A",
  },
  {
    name: "lettuce",
    src: "/burger/lettuce.webp",
    left: 1.5, top: 33.68, width: 97.0, height: 26.35,
    z: 215, rx: 5,
    label: "BUTTER LETTUCE",
    sub: "Hand-torn · never shredded",
    color: "#9BC53D",
  },
  {
    name: "tomato",
    src: "/burger/tomato.webp",
    left: 18.0, top: 41.3, width: 64.0, height: 19.3,
    z: 130, rx: 3,
    label: "VINE TOMATO",
    sub: "Vine-ripened · thick cut",
    color: "#E5533C",
  },
  {
    name: "cheese",
    src: "/burger/cheese.webp",
    left: 6.0, top: 51.06, width: 88.0, height: 26.01,
    z: 45, rx: 0,
    label: "AGED CHEDDAR",
    sub: "18 months · double slice",
    color: "#FFC24B",
  },
  {
    name: "patty",
    src: "/burger/patty.webp",
    left: 8.0, top: 60.33, width: 84.0, height: 31.6,
    z: -110, rx: -3,
    label: "SMASHED ANGUS",
    sub: "48h dry-aged · 200g",
    color: "#C97B4A",
  },
  {
    name: "bottom_bun",
    src: "/burger/bottom_bun.webp",
    left: 11.0, top: 73.51, width: 78.0, height: 23.58,
    z: -300, rx: -8,
    label: "TOASTED HEEL",
    sub: "Double-toasted · sauce-proof",
    color: "#D99A4E",
  },
];

export const MENU_ITEMS = [
  {
    name: "THE CLASSIC SMASH",
    desc: "Double smashed angus · aged cheddar · house sauce",
    price: "$14",
    img: "/menu/smash-classic.webp",
  },
  {
    name: "TOWER OF POWER",
    desc: "Triple stack · crispy shallots · bourbon glaze",
    price: "$19",
    img: "/menu/tower-dbl.webp",
  },
  {
    name: "TRUFFLE SHROOM",
    desc: "Wild mushrooms · truffle mayo · swiss melt",
    price: "$17",
    img: "/menu/truffle-shroom.webp",
  },
  {
    name: "DIRTY SAUCE",
    desc: "Charred patty · secret sauce · pickled jalapeño",
    price: "$15",
    img: "/menu/dirty-sauce.webp",
  },
];
