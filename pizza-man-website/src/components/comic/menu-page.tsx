'use client'

/* ============================================================
   Pizza-Man! — /menu client experience
   - Real-time comic search (name, description, badges)
   - Category tabs with counts
   - Comic empty state with reset
   - Mobile sticky order bar (count + total + view cart)
   ============================================================ */

import { useMemo, useState } from 'react'
import { ArrowRight, Search, SearchX, ShoppingBag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CATEGORIES,
  DUO_DEALS,
  MENU_ITEMS,
  formatPrice,
  type Category,
} from '@/lib/menu-data'
import { useCart } from '@/lib/cart-store'
import {
  ComicHeading,
  DishImage,
  PanelTag,
  Starburst,
} from '@/components/comic/primitives'
import { DishIcon } from '@/components/comic/dish-icons'
import { Navbar } from '@/components/comic/hero'
import { Footer } from '@/components/comic/sections'

/* ============ Menu card ============ */

function MenuCard({ id, eager = false }: { id: string; eager?: boolean }) {
  const item = MENU_ITEMS.find((m) => m.id === id)
  const { lines, add, setQty } = useCart()
  if (!item) return null
  const inCart = lines.find((l) => l.item.id === item.id)

  return (
    <article className="group relative flex flex-col border-[4px] border-ink bg-pulp shadow-comic transition-transform hover:-translate-y-1.5">
      {item.badge && (
        <span
          className={cn(
            'absolute -right-2 -top-3 z-10 rotate-3 border-[3px] border-ink px-2 py-0.5 font-display text-xs uppercase tracking-widest shadow-comic-sm',
            item.badge === 'Bestseller' && 'bg-comic-yellow text-ink',
            item.badge === 'Spicy' && 'bg-comic-red text-pulp',
            item.badge === 'Veggie' && 'bg-comic-teal text-ink',
            item.badge === 'New' && 'bg-comic-pink text-ink',
            item.badge === 'Deal' && 'bg-ink text-comic-yellow'
          )}
        >
          {item.badge}
        </span>
      )}

      <DishImage
        image={item.image}
        icon={item.icon}
        name={item.name}
        className="aspect-[4/3] w-full border-b-[4px] border-ink"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        eager={eager}
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="comic-title text-2xl uppercase leading-tight text-ink">{item.name}</h3>
        <p className="mt-2 flex-1 text-sm font-bold leading-relaxed text-ink/65">{item.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="comic-title text-2xl text-comic-red">{formatPrice(item.price)}</span>

          {inCart ? (
            <div className="flex items-center border-[3px] border-ink bg-paper shadow-comic-sm">
              <button
                type="button"
                onClick={() => setQty(item.id, inCart.qty - 1)}
                aria-label={`Remove one ${item.name}`}
                className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-comic-red hover:text-pulp"
              >
                −
              </button>
              <span className="w-9 text-center font-display text-lg text-ink" aria-live="polite">
                {inCart.qty}
              </span>
              <button
                type="button"
                onClick={() => add(item.id)}
                aria-label={`Add one ${item.name}`}
                className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-comic-teal"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => add(item.id)}
              aria-label={`Add ${item.name} to cart`}
              className="flex h-11 items-center gap-1.5 border-[3px] border-ink bg-comic-yellow px-4 font-display text-base uppercase tracking-wide text-ink shadow-comic-sm transition-all hover:-translate-y-0.5 hover:shadow-comic active:translate-y-0 active:shadow-none"
            >
              Add <span aria-hidden>+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

/* ============ Comic empty state ============ */

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="relative mx-auto mt-14 max-w-lg border-[5px] border-ink bg-pulp px-6 py-12 text-center shadow-comic-xl">
      <Starburst
        points={12}
        className="absolute -left-14 -top-14 h-40 w-40 animate-spin-slower text-comic-yellow"
      />
      <Starburst
        points={10}
        className="absolute -bottom-12 -right-12 h-32 w-32 animate-spin-slower text-comic-red/80"
      />
      <p className="comic-title text-5xl text-comic-red" style={{ textShadow: '3px 3px 0 var(--color-ink)' }}>
        KRAK!
      </p>
      <p className="comic-title mt-4 text-2xl uppercase text-ink">
        No hero found for “{query}”
      </p>
      <p className="mt-3 text-base font-bold text-ink/60">
        Even Pizza-Man&rsquo;s super-vision can&rsquo;t find that one. Try “pepperoni”, “cheese”,
        “spicy”… or summon the full league back!
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-12 items-center gap-2 border-[4px] border-ink bg-comic-teal px-6 font-display text-lg uppercase tracking-wider text-ink shadow-comic transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-comic-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
      >
        <SearchX className="h-5 w-5" /> Clear the search
      </button>
    </div>
  )
}

/* ============ Mobile sticky order bar ============ */

function StickyOrderBar() {
  const { count, total, openCart, fulfillment } = useCart()
  if (count === 0) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <button
        type="button"
        onClick={openCart}
        aria-label={`View cart — ${count} items, ${formatPrice(total)}`}
        className="flex w-full items-center justify-between gap-3 border-[4px] border-ink bg-ink px-4 py-3 text-comic-yellow shadow-comic-lg transition-transform active:translate-y-[3px] active:shadow-comic"
      >
        <span className="flex items-center gap-2.5 font-display text-lg uppercase tracking-wide">
          <span className="relative flex h-9 w-9 items-center justify-center border-[3px] border-comic-yellow bg-comic-red text-pulp">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            <span key={count} className="ono-pop absolute -right-2.5 -top-2.5 flex h-6 min-w-6 rotate-6 items-center justify-center border-[3px] border-ink bg-comic-yellow px-1 font-display text-xs text-ink">
              {count}
            </span>
          </span>
          <span className="text-left leading-tight">
            {count} item{count === 1 ? '' : 's'}
            <span className="block text-xs tracking-widest text-pulp/70">
              {fulfillment === 'pickup' ? 'Pickup — free!' : 'Delivery ready'}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-2 font-display text-xl">
          {formatPrice(total)}
          <span className="flex h-9 items-center border-[3px] border-ink bg-comic-yellow px-3 text-base uppercase text-ink">
            View cart <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </span>
      </button>
    </div>
  )
}

/* ============ The menu page ============ */

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const { openCart, count } = useCart()

  const normalized = query.trim().toLowerCase()

  const results = useMemo(() => {
    return MENU_ITEMS.filter((m) => {
      const inCategory = category === 'all' || m.category === category
      if (!inCategory) return false
      if (!normalized) return true
      return (
        m.name.toLowerCase().includes(normalized) ||
        m.description.toLowerCase().includes(normalized) ||
        (m.badge ?? '').toLowerCase().includes(normalized)
      )
    })
  }, [normalized, category])

  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of MENU_ITEMS) map.set(m.category, (map.get(m.category) ?? 0) + 1)
    map.set('all', MENU_ITEMS.length)
    return map
  }, [])

  const isSearching = normalized.length > 0

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-paper font-sans text-ink">
      <Navbar />

      <main className="flex-1">
        {/* ---------- Head ---------- */}
        <section className="relative overflow-hidden pb-10 pt-28 md:pt-36">
          <div aria-hidden className="speed-lines absolute right-0 top-0 h-56 w-72 text-ink/[0.06]" />
          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
            <PanelTag>
              <Search className="h-4 w-4" /> The full menu
            </PanelTag>
            <ComicHeading className="mx-auto mt-6 max-w-3xl text-4xl text-ink md:text-5xl">
              Pick your <span className="text-comic-red">power-up!</span>
            </ComicHeading>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-ink/70">
              Every hero has a story. Search, tap, add — your flavor squad assembles in seconds.
            </p>
          </div>
        </section>

        {/* ---------- Search + filters ---------- */}
        <section aria-label="Search and filters" className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="sticky top-[76px] z-30 border-[4px] border-ink bg-pulp p-3 shadow-comic sm:top-[84px]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search field */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your hero pizza… (pepperoni, veggie, spicy…)"
                  aria-label="Search the menu"
                  className="h-12 w-full border-[3px] border-ink bg-paper pl-11 pr-11 text-base font-bold text-ink shadow-comic-sm placeholder:font-normal placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-comic-yellow/70"
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-[3px] border-ink bg-comic-red text-pulp transition-transform active:translate-x-[2px]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Result count */}
              <p className="shrink-0 text-center font-display text-base uppercase tracking-wide text-ink md:text-right" aria-live="polite">
                <span className="border-[3px] border-ink bg-comic-teal px-3 py-1 shadow-comic-sm inline-block -rotate-1">
                  {results.length} hero{results.length === 1 ? '' : 'es'} found
                </span>
              </p>
            </div>

            {/* Category tabs */}
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5" role="tablist" aria-label="Menu categories">
              {CATEGORIES.map((c) => {
                const active = category === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      'shrink-0 border-[3px] border-ink px-3.5 py-1.5 font-display text-sm uppercase tracking-widest shadow-comic-sm transition-all active:translate-y-[2px] active:shadow-none',
                      active ? 'bg-comic-red text-pulp' : 'bg-paper text-ink hover:bg-comic-yellow/60'
                    )}
                  >
                    {c.label} <span className="opacity-60">({countsByCategory.get(c.id) ?? 0})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---------- Duo deals banner ---------- */}
        {category === 'all' && !isSearching && (
          <section aria-label="Duo deals" className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              {DUO_DEALS.map((d) => (
                <div key={d.id} className="relative flex items-center gap-4 border-[4px] border-ink bg-ink p-4 text-pulp shadow-comic">
                  <span aria-hidden className="flex h-14 w-14 shrink-0 rotate-3 items-center justify-center border-[3px] border-comic-yellow bg-comic-red">
                    <DishIcon name={d.icon} className="h-7 w-7 text-pulp" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg uppercase tracking-wide text-comic-yellow">
                      {d.title} <span className="text-pulp/70">— deal of the day</span>
                    </p>
                    <p className="truncate text-sm font-bold text-pulp/70">{d.description}</p>
                  </div>
                  <span className="comic-title shrink-0 text-2xl text-comic-yellow">{formatPrice(d.price)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Grid / empty state ---------- */}
        <section aria-label="Menu results" className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:pb-20">
          {results.length === 0 ? (
            <EmptyState
              query={query.trim() || category}
              onReset={() => {
                setQuery('')
                setCategory('all')
              }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((m, i) => (
                <MenuCard key={m.id} id={m.id} eager={i < 3} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Spacer so the footer never hides behind the sticky bar */}
      {count > 0 && <div aria-hidden className="h-24 lg:hidden" />}

      <Footer />

      {/* Mobile sticky order bar */}
      <StickyOrderBar />
    </div>
  )
}
