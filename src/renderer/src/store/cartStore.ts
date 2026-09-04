import { create } from 'zustand'

export interface CartItem {
  cartItemId: string // unique per line, since one product can have multiple lines (variants, repeated customer-named entries)
  productId: number
  variantId: number | null
  pricingType: 'fixed' | 'variant' | 'customer_named'
  name: string // e.g. "Soda — 500ml Plastic" or "Fries"
  unitPrice: number
  quantity: number
  lineTotal: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartItemId' | 'lineTotal'>) => void
  incrementItem: (cartItemId: string) => void
  decrementItem: (cartItemId: string) => void
  removeItem: (cartItemId: string) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    // Only fixed-price items merge into an existing line when tapped again.
    // Variant items are distinct per variant, and customer-named items always
    // start a fresh line since each entry represents a separately-named amount.
    if (item.pricingType === 'fixed') {
      const existing = get().items.find(
        (i) => i.productId === item.productId && i.pricingType === 'fixed'
      )
      if (existing) {
        get().incrementItem(existing.cartItemId)
        return
      }
    }

    const cartItemId = `${item.productId}-${item.variantId ?? 'x'}-${Date.now()}`
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          cartItemId,
          lineTotal: item.unitPrice * item.quantity
        }
      ]
    }))
  },

  incrementItem: (cartItemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: i.quantity + 1, lineTotal: i.unitPrice * (i.quantity + 1) }
          : i
      )
    }))
  },

  decrementItem: (cartItemId) => {
    set((state) => ({
      items: state.items
        .map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity - 1, lineTotal: i.unitPrice * (i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0)
    }))
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId)
    }))
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((sum, i) => sum + i.lineTotal, 0)
}))