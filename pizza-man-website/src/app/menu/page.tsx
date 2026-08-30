import type { Metadata } from 'next'
import MenuPage from '@/components/comic/menu-page'

export const metadata: Metadata = {
  title: 'The Menu — Pizza-Man! | All our hero pizzas, deals, desserts & drinks',
  description:
    'Browse the full Pizza-Man! menu: 9 hero pizzas from €8.90, duo deals, Nutella desserts and super drinks. Real-time search, one-tap add, delivery or pickup.',
}

export default function Menu() {
  return <MenuPage />
}
