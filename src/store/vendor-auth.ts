import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VendorState {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  isAuthenticated: boolean;
  setVendor: (data: { name: string; email: string; phone: string; location: string }) => void;
  login: (email: string) => void;
  updateProfile: (data: { name: string; phone: string; location: string }) => void;
  clearVendor: () => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      name: null,
      email: null,
      phone: null,
      location: null,
      isAuthenticated: false,
      setVendor: (data) => set({ ...data, isAuthenticated: true }),
      login: (email) => set({ email: get().email ?? email, isAuthenticated: true }),
      updateProfile: (data) => set(data),
      clearVendor: () => set({ name: null, email: null, phone: null, location: null, isAuthenticated: false }),
    }),
    { name: "vendor-auth" }
  )
);
