import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userData: {
    name: string;
    email: string;
    phone: string;
  } | null;
  setUserData: (data: { name: string; email: string; phone: string }) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      clearUserData: () => set({ userData: null }),
    }),
    { name: 'drenolearn-user-storage' } // Sauvegardé dans le localStorage
  )
);