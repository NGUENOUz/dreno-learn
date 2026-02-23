import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Définition de l'interface Course pour remplacer "any"
export interface Course {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category?: string;
}

// 2. Interface du Store avec des types stricts
export interface CartState {
  items: Course[]; 
  addToCart: (course: Course) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [], // Initialisé à 0 par défaut
      
      addToCart: (course: Course) => set((state) => ({ 
        // On vérifie si le cours est déjà présent pour éviter les doublons
        items: state.items.find(i => i.id === course.id) ? state.items : [...state.items, course] 
      })),
      
      removeFromCart: (id: string) => set((state) => ({ 
        items: state.items.filter(i => i.id !== id) 
      })),
      
      clearCart: () => set({ items: [] }),
    }),
    { name: 'drenolearn-cart' }
  )
);