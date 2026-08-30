/* ============================================================
   Pizza-Man! — menu data (single source of truth)
   All prices in EUR. Display format: €9.90
   ============================================================ */

export type Category = 'pizza' | 'dessert' | 'drink' | 'deal'

/**
 * Icon key for dish illustrations — rendered as Lucide comic icons via
 * DISH_ICONS (components/comic/dish-icons.tsx). NO emojis anywhere.
 */
export type DishIconName =
  | 'pizza'
  | 'cheese'
  | 'salad'
  | 'flame'
  | 'drumstick'
  | 'truffle'
  | 'fish'
  | 'rocket'
  | 'cookie'
  | 'coffee'
  | 'citrus'
  | 'soda'
  | 'water'
  | 'utensils'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image: string | null
  icon: DishIconName
  badge?: 'Bestseller' | 'Spicy' | 'Veggie' | 'New' | 'Deal'
}

export interface DuoDeal {
  id: string
  title: string
  description: string
  price: number
  icon: DishIconName
}

export const MENU_ITEMS: MenuItem[] = [
  /* ---------- PIZZAS (9) ---------- */
  {
    id: 'margherita',
    name: 'Captain Margherita',
    description: 'The founding father: tomato, fior di latte mozzarella, fresh basil and a lightning drizzle of olive oil.',
    price: 8.9,
    category: 'pizza',
    image: '/menu/margherita.png',
    icon: 'pizza',
    badge: 'Bestseller',
  },
  {
    id: 'pepperoni',
    name: 'Peerless Pepperoni',
    description: 'Crispy curled pepperoni piled on a bubbling cheese volcano. The hero this city deserves.',
    price: 10.9,
    category: 'pizza',
    image: '/menu/pepperoni.png',
    icon: 'pizza',
    badge: 'Bestseller',
  },
  {
    id: 'four-cheese',
    name: 'The Cheese Fortress',
    description: 'Mozzarella, gorgonzola, parmesan and fontina united to form one irresistible, melty stronghold.',
    price: 11.9,
    category: 'pizza',
    image: '/menu/four-cheese.png',
    icon: 'cheese',
    badge: 'Veggie',
  },
  {
    id: 'veggie',
    name: 'Garden Guardian',
    description: 'Bell peppers, cherry tomatoes, olives, red onion, mushrooms and arugula — the green league on dough.',
    price: 10.5,
    category: 'pizza',
    image: '/menu/veggie.png',
    icon: 'salad',
    badge: 'Veggie',
  },
  {
    id: 'inferno',
    name: 'Inferno Chili Blast',
    description: 'Spicy salami, red chilies and a chili-oil strike. Handle with oven mitts and a glass of milk.',
    price: 11.5,
    category: 'pizza',
    image: '/menu/inferno.png',
    icon: 'flame',
    badge: 'Spicy',
  },
  {
    id: 'bbq-chicken',
    name: 'BBQ Bandit',
    description: 'Grilled chicken, caramelized red onion, cilantro and smoky BBQ swirls. Steals hearts, not wallets.',
    price: 12.5,
    category: 'pizza',
    image: '/menu/bbq-chicken.png',
    icon: 'drumstick',
  },
  {
    id: 'truffle',
    name: 'Truffle Trouble',
    description: 'Truffle cream, roasted mushrooms, fontina and fresh thyme. Fancy enough to wear a tiny mask.',
    price: 13.9,
    category: 'pizza',
    image: '/menu/truffle.png',
    icon: 'truffle',
    badge: 'New',
  },
  {
    id: 'ocean',
    name: 'Ocean Avenger',
    description: 'Tuna flakes, black olives, red onion rings, capers and a lemon-zest tidal wave.',
    price: 12.9,
    category: 'pizza',
    image: '/menu/ocean.png',
    icon: 'fish',
  },
  {
    id: 'pizza-man-special',
    name: 'The Pizza-Man Special',
    description: 'Our legendary loaded supreme: pepperoni, sausage, mushrooms, peppers, olives and extra cheese. Cape not included.',
    price: 14.9,
    category: 'pizza',
    image: '/menu/pizza-man-special.png',
    icon: 'rocket',
    badge: 'Bestseller',
  },

  /* ---------- DESSERTS (2) ---------- */
  {
    id: 'nutella',
    name: 'Nutella Thunder',
    description: 'A warm pizza crust struck by melted Nutella, fresh strawberries, powdered sugar and crushed hazelnuts.',
    price: 7.5,
    category: 'dessert',
    image: '/menu/nutella.png',
    icon: 'cookie',
    badge: 'Bestseller',
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu Titan',
    description: 'Layers of mascarpone cream and coffee-soaked ladyfingers, dusted with cocoa. Stronger than espresso.',
    price: 6.5,
    category: 'dessert',
    image: '/menu/tiramisu.png',
    icon: 'coffee',
  },

  /* ---------- DRINKS (3) ---------- */
  {
    id: 'lemonade',
    name: 'Hero Lemonade',
    description: 'Sparkling homemade lemonade with mint and real lemon slices. Super refreshment in a jar.',
    price: 3.5,
    category: 'drink',
    image: '/menu/lemonade.png',
    icon: 'citrus',
  },
  {
    id: 'cola',
    name: 'Cap’s Cola',
    description: 'Ice-cold retro cola, served with a galaxy of bubbles. The classic sidekick.',
    price: 2.5,
    category: 'drink',
    image: '/menu/cola.png',
    icon: 'soda',
  },
  {
    id: 'water',
    name: 'Spring Water',
    description: 'Fresh mineral water with a lime twist. Even heroes need to hydrate.',
    price: 2.0,
    category: 'drink',
    image: '/menu/water.png',
    icon: 'water',
  },

  /* ---------- DEALS (2) ---------- */
  {
    id: 'duo-crime',
    name: 'Duo Crime',
    description: 'Any 2 classic pizzas (Margherita, Pepperoni or Veggie) + 2 Hero Lemonades. Perfect partners in crime.',
    price: 25.9,
    category: 'deal',
    image: '/menu/duo-crime.png',
    icon: 'pizza',
    badge: 'Deal',
  },
  {
    id: 'family-feast',
    name: 'Family Feast',
    description: '3 pizzas of your choice + 1 Nutella Thunder + 3 drinks. Feeds the whole justice league.',
    price: 39.9,
    category: 'deal',
    image: '/menu/family-feast.png',
    icon: 'utensils',
    badge: 'Deal',
  },
]

export const DUO_DEALS: DuoDeal[] = [
  {
    id: 'duo-crime',
    title: 'Duo Crime',
    description: '2 classic pizzas + 2 lemonades',
    price: 25.9,
    icon: 'pizza',
  },
  {
    id: 'family-feast',
    title: 'Family Feast',
    description: '3 pizzas + dessert + 3 drinks',
    price: 39.9,
    icon: 'utensils',
  },
]

/* Items shown in the cart drawer upsell row ("Complete your feast") */
export const UPSELL_ITEM_IDS = ['nutella', 'tiramisu', 'lemonade', 'cola', 'water']

export function findItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((i) => i.id === id)
}

export function priceOf(id: string): number {
  return findItem(id)?.price ?? 0
}

/** €9.90 format */
export function formatPrice(n: number): string {
  return `€${n.toFixed(2)}`
}

export const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All heroes' },
  { id: 'pizza', label: 'Pizzas' },
  { id: 'deal', label: 'Deals' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'drink', label: 'Drinks' },
]

/* ---------- Find us ---------- */

export const PIZZERIA_HOURS: { days: string; hours: string }[] = [
  { days: 'Monday — Thursday', hours: '11:30 — 22:30' },
  { days: 'Friday — Saturday', hours: '11:30 — 23:30' },
  { days: 'Sunday', hours: '12:00 — 22:00' },
]
