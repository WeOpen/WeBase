import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CurrentUser } from "@/lib/api/types";

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  setSession: (token: string, user: CurrentUser) => void;
  logout: () => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "webase-auth",
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : sessionStorage)),
    },
  ),
);
