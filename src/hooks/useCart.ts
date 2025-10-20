import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  slug: string
  selectedOption?: 'first' | 'second' // Hangi fiyat seçildi
  extraText?: string | null // 110gr/180gr gibi
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  discount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discountPercent: number) => void
  removeCoupon: () => void
  getTotal: () => number
  getTotalWithDiscount: () => number
  getItemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (item) => {
        set((state) => {
          // Aynı ürün ve aynı seçenek varsa quantity artır
          const existingItem = state.items.find(
            (i) => i.id === item.id && i.selectedOption === item.selectedOption
          )
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.selectedOption === item.selectedOption
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discount: 0 })
      },

      applyCoupon: (code, discountPercent) => {
        set({ couponCode: code, discount: discountPercent })
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 })
      },

      getTotal: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalWithDiscount: () => {
        const state = get()
        const total = state.getTotal()
        return total - (total * state.discount) / 100
      },

      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

