import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null,
  setAuth: (user, role, token) => set({ user, role, token }),
  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, role: null, token: null });
  },
}));
