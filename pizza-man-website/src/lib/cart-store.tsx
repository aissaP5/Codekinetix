'use client'

/* ============================================================
   Pizza-Man! — cart store (zustand + localStorage persistence)
   Fulfillment modes: 'delivery' (fee under €25) | 'pickup' (free)
   ============================================================ */

import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { findItem, formatPrice, type MenuItem } from '@/lib/menu-data'

/* ---------- Brand constants ---------- */

export const FREE_SHIPPING_THRESHOLD = 25
export const DELIVERY_FEE = 2.5
export const WHATSAPP_NUMBER = '33612345678' // placeholder — replace with the real pizzeria number
export const PIZZERIA_ADDRESS = '18 Place de la République, 75011 Paris, France'
export const PIZZERIA_PHONE_DISPLAY = '+33 6 12 34 56 78'

export const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps?q=18+Place+de+la+R%C3%A9publique,+75011+Paris,+France&z=16&output=embed&hl=en'

export type Fulfillment = 'delivery' | 'pickup'

export interface GeoPosition {
  lat: number
  lng: number
}

export type GeoStatus = 'idle' | 'locating' | 'ok' | 'error'

/* ---------- Store state ---------- */

interface CartState {
  items: Record<string, number>
  fulfillment: Fulfillment
  address: string
  coords: GeoPosition | null
  isOpen: boolean
  geoStatus: GeoStatus

  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  setFulfillment: (mode: Fulfillment) => void
  setAddress: (address: string) => void
  setCoords: (coords: GeoPosition | null) => void
  openCart: () => void
  closeCart: () => void
  setGeoStatus: (status: GeoStatus) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      fulfillment: 'delivery',
      address: '',
      coords: null,
      isOpen: false,
      geoStatus: 'idle',

      add: (id, qty = 1) =>
        set((s) => ({
          items: { ...s.items, [id]: Math.min((s.items[id] ?? 0) + qty, 99) },
        })),
      setQty: (id, qty) =>
        set((s) => {
          const items = { ...s.items }
          if (qty <= 0) delete items[id]
          else items[id] = Math.min(qty, 99)
          return { items }
        }),
      remove: (id) =>
        set((s) => {
          const items = { ...s.items }
          delete items[id]
          return { items }
        }),
      clear: () => set({ items: {} }),
      setFulfillment: (mode) => set({ fulfillment: mode }),
      setAddress: (address) => set({ address }),
      setCoords: (coords) => set({ coords }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setGeoStatus: (geoStatus) => set({ geoStatus }),
    }),
    {
      name: 'pizza-man-cart',
      // Only persist shopping data — never UI flags like isOpen/geoStatus
      partialize: (s) => ({
        items: s.items,
        fulfillment: s.fulfillment,
        address: s.address,
        coords: s.coords,
      }),
    }
  )
)

/* ---------- Derived values ---------- */

export interface CartLine {
  item: MenuItem
  qty: number
}

export interface CartApi {
  lines: CartLine[]
  count: number
  subtotal: number
  deliveryFee: number
  total: number
  /** amount still missing for free delivery (0 when unlocked or pickup) */
  missingForFree: number
  fulfillment: Fulfillment
  address: string
  coords: GeoPosition | null
  isOpen: boolean
  geoStatus: GeoStatus
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  setFulfillment: (mode: Fulfillment) => void
  setAddress: (address: string) => void
  openCart: () => void
  closeCart: () => void
  requestGeo: () => void
  whatsappUrl: () => string
}

/** Rich hook over the raw store: derives lines/totals and geo helpers. */
export function useCart(): CartApi {
  const items = useCartStore((s) => s.items)
  const fulfillment = useCartStore((s) => s.fulfillment)
  const address = useCartStore((s) => s.address)
  const coords = useCartStore((s) => s.coords)
  const isOpen = useCartStore((s) => s.isOpen)
  const geoStatus = useCartStore((s) => s.geoStatus)
  const add = useCartStore((s) => s.add)
  const setQtyAction = useCartStore((s) => s.setQty)
  const removeAction = useCartStore((s) => s.remove)
  const clearAction = useCartStore((s) => s.clear)
  const setFulfillmentAction = useCartStore((s) => s.setFulfillment)
  const setAddressAction = useCartStore((s) => s.setAddress)
  const openCartAction = useCartStore((s) => s.openCart)
  const closeCartAction = useCartStore((s) => s.closeCart)

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(items)
        .map(([id, qty]) => {
          const item = findItem(id)
          return item ? { item, qty } : null
        })
        .filter((l): l is CartLine => l !== null),
    [items]
  )

  const count = useMemo(() => lines.reduce((acc, l) => acc + l.qty, 0), [lines])
  const subtotal = useMemo(() => lines.reduce((acc, l) => acc + l.qty * l.item.price, 0), [lines])

  const deliveryFee = useMemo(() => {
    if (fulfillment === 'pickup') return 0
    if (subtotal <= 0) return 0
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE
  }, [fulfillment, subtotal])

  const total = subtotal + deliveryFee

  const missingForFree = useMemo(() => {
    if (fulfillment === 'pickup') return 0
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  }, [fulfillment, subtotal])

  /* Geolocation + reverse geocoding (English labels) */
  const requestGeo = () => {
    const { setGeoStatus, setCoords: setPos, setAddress: setAddr } = useCartStore.getState()
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const nextCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextCoords.lat}&lon=${nextCoords.lng}&accept-language=en`,
            { headers: { Accept: 'application/json' } }
          )
          const data = (await res.json()) as { display_name?: string }
          setPos(nextCoords)
          if (data.display_name) setAddr(data.display_name)
        } catch {
          setPos(nextCoords)
        }
        useCartStore.getState().setGeoStatus('ok')
      },
      () => useCartStore.getState().setGeoStatus('error'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }

  /* English WhatsApp order message */
  const whatsappUrl = () => {
    const L: string[] = []
    L.push('PIZZA-MAN! — NEW ORDER')
    L.push('==========================')
    if (lines.length === 0) {
      L.push('(empty cart)')
    } else {
      for (const { item, qty } of lines) {
        L.push(`${qty} x ${item.name} — ${formatPrice(qty * item.price)}`)
      }
      L.push('--------------------------')
      L.push(`Subtotal: ${formatPrice(subtotal)}`)
      L.push(
        fulfillment === 'pickup'
          ? 'Pickup: FREE'
          : `Delivery: ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}`
      )
      L.push(`TOTAL: ${formatPrice(total)}`)
      L.push('==========================')
      L.push(`Mode: ${fulfillment === 'pickup' ? 'PICKUP (in store)' : 'DELIVERY'}`)
      if (fulfillment === 'delivery') {
        if (address.trim()) L.push(`Address: ${address.trim()}`)
        if (coords) L.push(`GPS: https://maps.google.com/?q=${coords.lat},${coords.lng}`)
      } else {
        L.push(`Pickup at: ${PIZZERIA_ADDRESS}`)
      }
    }
    L.push('==========================')
    L.push('My hungry stomach is ready!')

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(L.join('\n'))}`
  }

    return {
    lines,
    count,
    subtotal,
    deliveryFee,
    total,
    missingForFree,
    fulfillment,
    address,
    coords,
    isOpen,
    geoStatus,
    add,
    setQty: setQtyAction,
    remove: removeAction,
    clear: clearAction,
    setFulfillment: setFulfillmentAction,
    setAddress: setAddressAction,
    openCart: openCartAction,
    closeCart: closeCartAction,
    requestGeo,
    whatsappUrl,
  }
}
