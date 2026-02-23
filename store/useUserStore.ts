import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone:string;
  avatar?: string;
}

interface UserState {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      clearUserData: () => {
        set({ userData: null });
        // Optionnel : vider aussi le panier à la déconnexion
        // useCartStore.getState().clearCart(); 
      },
    }),
    { name: 'drenolearn-user-session' }
  )
);