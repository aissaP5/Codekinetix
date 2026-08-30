import { Navbar, CoverHero } from '@/components/comic/hero'
import {
  MarqueeBands,
  ComicStrip,
  MenuPreview,
  Stats,
  FanMail,
  FindUs,
  FinalCTA,
  Footer,
} from '@/components/comic/sections'
import { UnboxTransition } from '@/components/comic/pizza-box'
import { ZigzagEdge } from '@/components/comic/primitives'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-paper font-sans text-ink">
      <Navbar />
      <main className="flex-1">
        <CoverHero />
        <MarqueeBands />
        <ComicStrip />
        <UnboxTransition />
        <MenuPreview />
        <ZigzagEdge className="bg-paper text-ink" />
        <Stats />
        <FanMail />
        <FindUs />
        <FinalCTA />
        <ZigzagEdge className="bg-paper text-ink" />
        <Footer />
      </main>
    </div>
  )
}
