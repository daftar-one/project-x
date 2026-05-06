import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  production_house_id: string | null;
  production_house_name: string | null;
  setAuth: (user: User) => void;
  setProductionHouseId: (id: string) => void;
  setProductionHouseName: (name: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      production_house_id: null,
      production_house_name: null,
      setAuth: (user) => set({ user }),
      setProductionHouseId: (id) => set({ production_house_id: id }),
      setProductionHouseName: (name) => set({ production_house_name: name }),
      clearAuth: () => set({ user: null, production_house_id: null, production_house_name: null }),
    }),
    { name: "auth" }
  )
);

