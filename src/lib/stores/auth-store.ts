import { create } from "zustand";

import type { CurrentUser } from "@/lib/api/types";

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  setSession: (token: string, user: CurrentUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
