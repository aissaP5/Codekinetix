import {
  ChefHat,
  Citrus,
  Coffee,
  Cookie,
  CupSoda,
  Drumstick,
  Fish,
  Flame,
  GlassWater,
  Pizza,
  Rocket,
  Salad,
  UtensilsCrossed,
  VenetianMask,
  type LucideIcon,
} from 'lucide-react'
import type { DishIconName } from '@/lib/menu-data'

/**
 * NO-EMOJI POLICY — every dish pictogram on the site is a crisp Lucide icon
 * (thick strokes, comic-friendly) instead of a platform-dependent emoji.
 * Keyed by the `icon` field of MenuItem / DuoDeal in src/lib/menu-data.ts.
 */
export const DISH_ICONS: Record<DishIconName, LucideIcon> = {
  pizza: Pizza,
  cheese: ChefHat,
  salad: Salad,
  flame: Flame,
  drumstick: Drumstick,
  truffle: VenetianMask, // "fancy enough to wear a tiny mask" — Truffle Trouble
  fish: Fish,
  rocket: Rocket, // the Pizza-Man Special takes flight
  cookie: Cookie,
  coffee: Coffee,
  citrus: Citrus,
  soda: CupSoda,
  water: GlassWater,
  utensils: UtensilsCrossed,
}

export function DishIcon({ name, className }: { name: DishIconName; className?: string }) {
  const Icon = DISH_ICONS[name]
  return <Icon className={className} aria-hidden="true" />
}
