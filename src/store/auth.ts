import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  production_house_id: string | null;
  setAuth: (user: User) => void;
  setProductionHouseId: (id: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      production_house_id: null,
      setAuth: (user) => set({ user }),
      setProductionHouseId: (id) => set({ production_house_id: id }),
      clearAuth: () => set({ user: null, production_house_id: null }),
    }),
    { name: "auth" }
  )
);
