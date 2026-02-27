import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string; // UUID interne
  chariow_id: string;
  title: string;
  price: number;
  image_url: string;
  type: "courses" | "guides"; // Pour savoir vers quel checkout le rediriger
};

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (chariow_id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Éviter les doublons dans le panier
          if (state.items.find((i) => i.chariow_id === item.chariow_id)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (chariow_id) =>
        set((state) => ({
          items: state.items.filter((i) => i.chariow_id !== chariow_id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'drenolearn-cart', // Nom dans le localStorage
    }
  )
);