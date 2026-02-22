// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create()(
  persist((set) => ({
    items: [], // Liste vide par défaut
    addToCart: (course) => set((state) => ({ 
      items: state.items.find(i => i.id === course.id) ? state.items : [...state.items, course] 
    })),
    removeFromCart: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
    clearCart: () => set({ items: [] }),
  }), { name: 'drenolearn-cart' })
);