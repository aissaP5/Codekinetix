'use client'

/* ============================================================
   Pizza-Man! — cart UI
   - CartButton (navbar pill with live count badge)
   - CartDrawer: delivery/pickup toggle, free-delivery progress,
     "Complete your feast" upsell row, GPS address helper,
     English WhatsApp checkout
   ============================================================ */

import Image from 'next/image'
import {
  Bike,
  LoaderCircle,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UPSELL_ITEM_IDS, findItem, formatPrice } from '@/lib/menu-data'
import { FREE_SHIPPING_THRESHOLD, useCart } from '@/lib/cart-store'
import { ComicLink } from '@/components/comic/primitives'
import { DishIcon } from '@/components/comic/dish-icons'

/* ============ Navbar cart button ============ */

export function CartButton({ className }: { className?: string }) {
  const { count, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open your cart — ${count} item${count === 1 ? '' : 's'}`}
      className={cn(
        'relative flex h-11 min-w-11 items-center justify-center gap-1.5 border-[3px] border-ink bg-comic-yellow px-2.5 shadow-comic-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        className
      )}
    >
      <ShoppingBag className="h-5 w-5 text-ink" />
      {count > 0 && (
        <span
          key={count}
          className="ono-pop absolute -right-2 -top-2 flex h-6 min-w-6 rotate-6 items-center justify-center border-[3px] border-ink bg-comic-red px-1 font-display text-xs text-pulp"
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ============ One cart line ============ */

function CartLineRow({ id, qty }: { id: string; qty: number }) {
  const { setQty, remove } = useCart()
  const item = findItem(id)
  if (!item) return null

  return (
    <li className="border-[3px] border-ink bg-pulp p-2.5 shadow-comic-sm">
      {/* Row 1: image + name + delete */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-[3px] border-ink bg-comic-yellow/40 text-2xl">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <DishIcon name={item.icon} className="h-7 w-7 text-ink" />
          )}
        </span>

        <p className="min-w-0 flex-1 font-display text-base uppercase leading-tight tracking-wide text-ink">
          {item.name}
        </p>

        <button
          type="button"
          onClick={() => remove(id)}
          aria-label={`Delete ${item.name} from cart`}
          className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-transparent text-ink/40 transition-colors hover:border-ink hover:bg-comic-red hover:text-pulp"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Row 2: unit price + stepper + line total */}
      <div className="mt-2 flex items-center justify-between gap-2 pl-[68px]">
        <p className="text-xs font-bold text-ink/60">{formatPrice(item.price)} each</p>
        <div className="flex items-center border-[3px] border-ink bg-paper">
          <button
            type="button"
            onClick={() => setQty(id, qty - 1)}
            aria-label={`Remove one ${item.name}`}
            className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-comic-red hover:text-pulp"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-display text-base text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(id, qty + 1)}
            aria-label={`Add one ${item.name}`}
            className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-comic-teal"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="w-16 shrink-0 text-right font-display text-base text-comic-red">
          {formatPrice(qty * item.price)}
        </p>
      </div>
    </li>
  )
}

/* ============ Fulfillment toggle (delivery / pickup) ============ */

function FulfillmentToggle() {
  const { fulfillment, setFulfillment } = useCart()

  return (
    <div role="radiogroup" aria-label="Order mode" className="grid grid-cols-2 gap-3">
      <button
        type="button"
        role="radio"
        aria-checked={fulfillment === 'delivery'}
        onClick={() => setFulfillment('delivery')}
        className={cn(
          'flex items-center justify-center gap-2 border-[4px] border-ink px-3 py-2.5 font-display text-base uppercase tracking-wide shadow-comic-sm transition-all',
          fulfillment === 'delivery' ? 'bg-comic-red text-pulp' : 'bg-pulp text-ink hover:-translate-y-0.5'
        )}
      >
        <Bike className="h-5 w-5 shrink-0" /> Delivery
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={fulfillment === 'pickup'}
        onClick={() => setFulfillment('pickup')}
        className={cn(
          'relative flex items-center justify-center gap-2 border-[4px] border-ink px-3 py-2.5 font-display text-base uppercase tracking-wide shadow-comic-sm transition-all',
          fulfillment === 'pickup' ? 'bg-comic-red text-pulp' : 'bg-pulp text-ink hover:-translate-y-0.5'
        )}
      >
        <Store className="h-5 w-5 shrink-0" /> Pickup
        <span
          aria-hidden
          className="absolute -right-2 -top-3 rotate-6 border-[3px] border-ink bg-comic-teal px-1.5 py-0.5 font-display text-[10px] uppercase tracking-widest text-ink"
        >
          Free!
        </span>
      </button>
    </div>
  )
}

/* ============ Free delivery progress (delivery mode only) ============ */

function FreeDeliveryProgress() {
  const { subtotal, missingForFree } = useCart()
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <div className="border-[3px] border-dashed border-ink/50 bg-comic-yellow/30 p-3">
      {missingForFree > 0 ? (
        <p className="font-display text-sm uppercase tracking-wide text-ink">
          Add <span className="text-comic-red">{formatPrice(missingForFree)}</span> more for FREE delivery!
        </p>
      ) : (
        <p className="font-display text-sm uppercase tracking-wide text-ink">
          <Star className="mr-1 inline h-4 w-4 -translate-y-0.5 fill-ink" aria-hidden />
          Free delivery unlocked, hero!
        </p>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free delivery"
        className="mt-2 h-4 border-[3px] border-ink bg-pulp"
      >
        <div className="h-full bg-comic-teal transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ============ "Complete your feast" upsell row ============ */

function UpsellRow() {
  const { lines, add } = useCart()
  const inCart = new Set(lines.map((l) => l.item.id))
  const suggestions = UPSELL_ITEM_IDS.map(findItem).filter((i): i is NonNullable<typeof i> => Boolean(i))

  return (
    <section aria-label="Complete your feast" className="border-[4px] border-ink bg-comic-pink/25 p-3">
      <p className="font-display text-sm uppercase tracking-widest text-ink">
        <UtensilsCrossed className="mr-1.5 inline h-4 w-4 -translate-y-0.5" aria-hidden /> Complete
        your feast!
      </p>
      <p className="mt-0.5 text-xs font-bold text-ink/60">
        One tap to add a sidekick to your pizzas.
      </p>
      <ul className="no-scrollbar mt-2.5 flex gap-2.5 overflow-x-auto pb-1">
        {suggestions.map((s) => (
          <li key={s.id} className="shrink-0">
            <button
              type="button"
              onClick={() => add(s.id)}
              aria-label={`Add ${s.name} — ${formatPrice(s.price)}`}
              className={cn(
                'group flex w-36 flex-col items-center gap-1 border-[3px] border-ink bg-pulp p-2 shadow-comic-sm transition-all hover:-translate-y-0.5 hover:shadow-comic active:translate-y-0 active:shadow-none',
                inCart.has(s.id) && 'bg-comic-teal/20'
              )}
            >
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden border-[3px] border-ink bg-comic-yellow/40 text-2xl">
                {s.image ? (
                  <Image src={s.image} alt="" width={48} height={48} className="h-full w-full object-cover" draggable={false} />
                ) : (
                  <DishIcon name={s.icon} className="h-6 w-6 text-ink" />
                )}
              </span>
              <span className="line-clamp-1 min-h-5 w-full text-center text-xs font-bold text-ink">{s.name}</span>
              <span className="flex items-center gap-1.5">
                <span className="font-display text-sm text-ink">{formatPrice(s.price)}</span>
                <span className="flex h-5 w-5 items-center justify-center border-2 border-ink bg-comic-yellow text-ink transition-transform group-hover:rotate-90">
                  <Plus className="h-3 w-3" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ============ Delivery address block (delivery mode only) ============ */

function AddressBlock() {
  const { address, setAddress, coords, requestGeo, geoStatus } = useCart()

  return (
    <div className="space-y-2">
      <label htmlFor="cart-address" className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide text-ink">
        <MapPin className="h-4 w-4 text-comic-red" /> Delivery address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="cart-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, number, city…"
          className="h-11 flex-1 border-[3px] border-ink bg-pulp px-3 text-sm font-bold text-ink shadow-comic-sm placeholder:font-normal placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-comic-yellow/70"
        />
        <button
          type="button"
          onClick={() => void requestGeo()}
          disabled={geoStatus === 'locating'}
          className="flex h-11 items-center justify-center gap-2 border-[3px] border-ink bg-comic-teal px-3 font-display text-sm uppercase tracking-wide text-ink shadow-comic-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-70"
        >
          {geoStatus === 'locating' ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Locating…
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" /> Use my position
            </>
          )}
        </button>
      </div>
      {geoStatus === 'error' && (
        <p role="alert" className="text-xs font-bold text-comic-red">
          POW! We couldn&rsquo;t get your position — type your address instead.
        </p>
      )}
      {geoStatus === 'ok' && coords && (
        <p className="text-xs font-bold text-ink/60">
          <MapPin className="mr-0.5 inline h-3.5 w-3.5 -translate-y-px" aria-hidden /> GPS locked at{' '}
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} — attached to your order.
        </p>
      )}
    </div>
  )
}

/* ============ Empty cart state ============ */

function EmptyCart() {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <p className="comic-title relative text-5xl text-comic-red" style={{ textShadow: '3px 3px 0 var(--color-ink)' }}>
        KRAK!
      </p>
      <p className="mt-4 max-w-xs text-lg font-bold text-ink/80">
        Your cart is emptier than a ghost town on a Sunday morning…
      </p>
      <p className="mt-1 text-sm font-bold text-ink/50">Even Pizza-Man can&rsquo;t deliver nothing. Fill it with heroes!</p>
      <ComicLink href="/menu" color="yellow" className="mt-6">
        Browse the menu
      </ComicLink>
    </div>
  )
}

/* ============ The drawer ============ */

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    count,
    subtotal,
    deliveryFee,
    total,
    fulfillment,
    whatsappUrl,
  } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your cart">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="fade-in-soft absolute inset-0 h-full w-full cursor-default bg-ink/70"
      />

      {/* Panel */}
      <div className="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-md translate-x-0 flex-col border-l-[4px] border-ink bg-paper shadow-comic-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b-[4px] border-ink bg-comic-yellow px-4 py-3">
          <h2 className="comic-title text-2xl uppercase text-ink">
            Your hero cart {count > 0 && <span className="text-comic-red">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-pulp shadow-comic-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <X className="h-5 w-5 text-ink" />
          </button>
        </header>

        {lines.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Scrollable body */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <FulfillmentToggle />

              {fulfillment === 'pickup' ? (
                <p className="border-[3px] border-dashed border-ink/50 bg-comic-teal/20 p-3 text-sm font-bold text-ink">
                  <Store className="mr-1 inline h-4 w-4 -translate-y-px" aria-hidden /> Grab your pizzas
                  hot at the pizzeria — <strong>no delivery fee, no GPS needed.</strong> Ready in ~15
                  min!
                </p>
              ) : (
                <FreeDeliveryProgress />
              )}

              <ul className="space-y-3">
                {lines.map((l) => (
                  <CartLineRow key={l.item.id} id={l.item.id} qty={l.qty} />
                ))}
              </ul>

              <UpsellRow />

              {fulfillment === 'delivery' && <AddressBlock />}
            </div>

            {/* Footer totals + checkout */}
            <footer className="border-t-[4px] border-ink bg-pulp p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <dl className="space-y-1 text-sm font-bold text-ink/80">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{fulfillment === 'pickup' ? 'Pickup fee' : 'Delivery fee'}</dt>
                  <dd className={deliveryFee === 0 ? 'text-comic-teal' : ''}>
                    {deliveryFee === 0 ? 'FREE!' : formatPrice(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t-[3px] border-dashed border-ink/40 pt-1.5">
                  <dt className="comic-title text-xl text-ink">Total</dt>
                  <dd className="comic-title text-xl text-comic-red">{formatPrice(total)}</dd>
                </div>
              </dl>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-14 w-full items-center justify-center gap-2 border-[4px] border-ink bg-[#25d366] font-display text-lg uppercase tracking-wider text-ink shadow-comic transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-comic-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-ink" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                </svg>
                Order via WhatsApp
              </a>
              <p className="mt-2 text-center text-xs font-bold text-ink/50">
                Pay on delivery or pickup — cash &amp; cards welcome!
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
